import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getAccommodations, getStages } from "../db";

const SYSTEM_PROMPT = `Eres un asistente experto en el Camino Francés del Camino de Santiago. Tu rol es proporcionar información precisa, útil y amable a los peregrinos.

Información clave sobre el Camino Francés:
- Distancia total: aproximadamente 760-930 km
- Número de etapas: 33 etapas
- Punto de inicio: Saint-Jean-Pied-de-Port (Francia) o Roncesvalles (España)
- Punto final: Santiago de Compostela
- Duración típica: 30-35 días caminando
- Mejor época: primavera (abril-mayo) y otoño (septiembre-octubre)

Servicios que ofrece Camino Claro:
1. Consulta de Orientación: 5-10€ - Respuestas sobre el Camino, etapas, alojamientos
2. Planificación de Etapa: 10-15€ - Ayuda para planificar la siguiente etapa
3. Búsqueda de Alojamiento: 15-25€ - Recomendaciones de alojamientos
4. Gestión Completa: 25-30€ - Planificación integral del viaje

Importante:
- NO somos una empresa turística
- NO realizamos reservas de alojamiento
- Somos un servicio de orientación y apoyo
- Se informa del precio en cada consulta

Proporciona respuestas útiles, empáticas y prácticas. Si el usuario necesita servicios personalizados, sugiere que se comunique con el equipo a través del formulario de contacto.`;

export const chatbotRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Obtener datos de la base de datos para enriquecer el contexto
        const accommodations = await getAccommodations();
        const stages = await getStages();

        // Crear contexto enriquecido con datos reales
        let enrichedContext = SYSTEM_PROMPT;

        // Si el usuario pregunta sobre alojamientos, agregar información de la base de datos
        if (
          input.message.toLowerCase().includes("alojamiento") ||
          input.message.toLowerCase().includes("hotel") ||
          input.message.toLowerCase().includes("albergue") ||
          input.message.toLowerCase().includes("hospedería")
        ) {
          if (accommodations && accommodations.length > 0) {
            enrichedContext += "\n\nAlojamientos disponibles en el Camino Francés:\n";
            accommodations.slice(0, 5).forEach((acc: any) => {
              enrichedContext += `- ${acc.name} (${acc.location}, ${acc.stage}): ${acc.pricePerNight}€/noche - ${acc.description}\n`;
            });
          }
        }

        // Si el usuario pregunta sobre etapas, agregar información de etapas
        if (
          input.message.toLowerCase().includes("etapa") ||
          input.message.toLowerCase().includes("distancia") ||
          input.message.toLowerCase().includes("dificultad")
        ) {
          if (stages && stages.length > 0) {
            enrichedContext += "\n\nEtapas del Camino Francés:\n";
            stages.slice(0, 5).forEach((stage: any) => {
              enrichedContext += `- Etapa ${stage.stageNumber}: ${stage.name} (${stage.distanceKm}km, dificultad ${stage.difficulty}/5)\n`;
            });
          }
        }

        const messages = [
          { role: "system" as const, content: enrichedContext },
          ...(input.conversationHistory || []),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({
          messages: messages as any,
        });

        const assistantMessage =
          response.choices[0]?.message?.content || "No se pudo generar una respuesta.";

        return {
          success: true,
          message: assistantMessage,
        };
      } catch (error) {
        console.error("[Chatbot] Error calling LLM:", error);
        return {
          success: false,
          message:
            "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo o contacta con nuestro equipo.",
        };
      }
    }),

  getAccommodationsByStage: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const accommodations = await getAccommodations(input);
        return {
          success: true,
          data: accommodations,
        };
      } catch (error) {
        console.error("[Chatbot] Error getting accommodations:", error);
        return {
          success: false,
          data: [],
        };
      }
    }),

  getStageInfo: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      try {
        const stages = await getStages();
        const stage = stages?.find((s: any) => s.stageNumber === input);
        return {
          success: true,
          data: stage || null,
        };
      } catch (error) {
        console.error("[Chatbot] Error getting stage info:", error);
        return {
          success: false,
          data: null,
        };
      }
    }),
});
