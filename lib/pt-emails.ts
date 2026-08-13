/** PT contact emails from questionnaire export — used for Send Brief */
export const PT_EMAIL_BY_ID: Record<number, string> = {
  1: "pt.craig.clout@gmail.com",
  2: "jessrosedonehue@gmail.com",
  3: "maxperformance251@gmail.com",
  4: "greenwoodmara99@gmail.com",
  7: "alicefarrow@hotmail.co.uk",
  9: "sam@sampepys.com",
  10: "aimeejeffs78@gmail.com",
  11: "lcloves.pt@gmail.com",
  12: "gordongraceindia@gmail.com",
  13: "adrian.maxoutday@gmail.com",
  14: "anastasiaalicept@icloud.com",
  15: "daniel.arase@hotmail.com",
};

export function getPtEmail(ptId: number): string | undefined {
  return PT_EMAIL_BY_ID[ptId];
}
