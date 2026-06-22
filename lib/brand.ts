export const APP_NAME = "LOVE %";

export function appFromEmail(email: string) {
  return `${APP_NAME} <${email}>`;
}
