import { google } from "googleapis";
import path from "path";

const keyFilePath = path.join(
  process.cwd(),
  "src",
  "credentials",
  "service-account.json"
);

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}