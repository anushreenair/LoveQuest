import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function escapeAppleScript(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, '" & return & "');
}

export async function sendViaMacMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (process.platform !== "darwin") {
    return {
      success: false as const,
      error: "macOS Mail is only available on Mac",
    };
  }

  const script = `
    tell application "Mail"
      set newMessage to make new outgoing message with properties {subject:"${escapeAppleScript(subject)}", visible:false}
      tell newMessage
        make new to recipient at end of to recipients with properties {address:"${escapeAppleScript(to)}"}
        set content to "${escapeAppleScript(text)}"
      end tell
      send newMessage
    end tell
  `;

  try {
    await execFileAsync("osascript", ["-e", script]);
    return { success: true as const, data: { id: "mac-mail" } };
  } catch (error) {
    console.error("macOS Mail send failed:", error);
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Could not send via Mail.app",
    };
  }
}
