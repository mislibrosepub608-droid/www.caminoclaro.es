import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getStages, getStageById, getAccommodations, getBlogArticles, getBlogArticleBySlug, createUserConsultation } from "./db";
import { notifyOwner } from "./_core/notification";
import { chatbotRouter } from "./routers/chatbot";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stages: router({
    list: publicProcedure.query(async () => {
      return getStages();
    }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getStageById(input);
      }),
  }),

  accommodations: router({
    list: publicProcedure
      .input(z.object({ stage: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getAccommodations(input?.stage);
      }),
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(["albergue", "hostal", "hotel", "pension", "otro"]),
        location: z.string(),
        stage: z.string(),
        pricePerNight: z.number().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { success: true, message: "Alojamiento creado" };
      }),
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        type: z.enum(["albergue", "hostal", "hotel", "pension", "otro"]),
        location: z.string(),
        stage: z.string(),
        pricePerNight: z.number().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { success: true, message: "Alojamiento actualizado" };
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return { success: true, message: "Alojamiento eliminado" };
      }),
  }),

  blog: router({
    list: publicProcedure.query(async () => {
      return getBlogArticles(true);
    }),
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return getBlogArticleBySlug(input);
      }),
  }),

  consultations: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        serviceType: z.enum(["orientation_consultation", "stage_planning", "accommodation_search", "complete_management", "general_inquiry"]),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createUserConsultation({
          name: input.name,
          email: input.email,
          phone: input.phone,
          serviceType: input.serviceType,
          description: input.description,
          status: "new",
        });

        // Notificar al propietario
        await notifyOwner({
          title: `Nueva consulta de ${input.name}`,
          content: `Tipo de servicio: ${input.serviceType}\nEmail: ${input.email}\nTelephone: ${input.phone || "No proporcionado"}\n\nMensaje: ${input.description || "Sin descripcion"}`,
        });

        return result;
      }),
  }),

  chatbot: chatbotRouter,
});

export type AppRouter = typeof appRouter;
