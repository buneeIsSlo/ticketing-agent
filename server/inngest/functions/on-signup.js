import { inngest } from "../client";
import { redBright } from "yoctocolors";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";

export const onUserSignUp = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("Signup failed: user not found");
        }
        return userObject;
      });

      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to Ticketing Agent";
        const message = `Hi,
        \n\n
        Thanks for signing up. We're glad to have you onboard!
        `;
        await sendMail(user.email, subject, message);
      });

      return { success: true };
    } catch (error) {
      console.error(redBright("Error running step"), error.message);
      return { success: false };
    }
  }
);
