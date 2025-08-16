import lotSurveyApi from "~/app/api/lotSurvey.api";
import { createLotSurveyPayload } from "~/utils/createLotSurveyPayload";

export function useLotSurveyUploader() {
  async function submitBulk(items: any[]) {
    await Promise.all(
      items.map(async (data) => {
        const dataPayload = createLotSurveyPayload(data);
        try {
          await lotSurveyApi.post_lot_survey_monitorings({
            data: dataPayload,
            images: null,
          });
        } catch {
          const resp: any = await lotSurveyApi.get_persil_by_fid(data.UUID);
          await lotSurveyApi.EditMonitoring(
            { data: dataPayload, images: null },
            resp.id
          );
        }
      })
    );
  }

  async function submitBulkBatch(items: any[], chunkSize = 50) {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await Promise.allSettled(
        chunk.map(async (data) => {
          const dataPayload = createLotSurveyPayload(data);
          try {
            await lotSurveyApi.post_lot_survey_monitorings({
              data: dataPayload,
              images: null,
            });
          } catch {
            try {
              const resp: any = await lotSurveyApi.get_persil_by_fid(data.UUID);
              await lotSurveyApi.EditMonitoring(
                { data: dataPayload, images: null },
                resp.id
              );
            } catch (err) {
              console.error(`Gagal proses UUID: ${data.UUID}`, err);
            }
          }
        })
      );
    }
  }

  return { submitBulk, submitBulkBatch };
}
