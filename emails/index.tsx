import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
}

export const NotionWaitlistEmail = ({ userFirstname }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome! Your crypto wallet has been created 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://emailwallets.com/waitlist-logo.png`}
          width="220"
          height="100"
          alt="Email Wallets Logo"
          style={logo}
        />
        <Text style={greeting}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          🎉 <strong>Welcome to the future!</strong> You just created a crypto wallet with nothing but your email address.
        </Text>
        <Text style={paragraph}>
          Here's what just happened:
          <br />
          ✅ Created a secure, non-custodial crypto wallet
          <br />
          ✅ No seed phrases to remember or lose
          <br />
          ✅ Ready to receive crypto payments globally
          <br />
          ✅ Works on any device, anywhere in the world
        </Text>
        <Text style={paragraph}>
          You're now part of an exclusive group experimenting with the next generation of Web3 - where crypto feels just like any modern app.
        </Text>
        <Text style={paragraph}>
          Want to build something like this? Check out the{" "}
          <a href="https://portal.cdp.coinbase.com/" style={link}>
            Coinbase Developer Platform
          </a>
          {" "}or fork our{" "}
          <a href="https://github.com/Must-be-Ash/email-wallets" style={link}>
            open-source template
          </a>
        </Text>
        <Text style={signOff}>
          Welcome to invisible Web3! 🚀
          <br />
          Coinbase Developer Platform
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because you signed up and automatically created a crypto wallet.
          Powered by CDP Embedded Wallets.
        </Text>
      </Container>
    </Body>
  </Html>
);

NotionWaitlistEmail.PreviewProps = {
  userFirstname: "Tyler",
} as EmailProps;

export default NotionWaitlistEmail;

const main = {
  background: "linear-gradient(-225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
  fontFamily: 'figtree, "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
  color: "#cccccc",
};

const container = {
  margin: "0 auto",
  padding: "24px 32px 48px",
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto",
  paddingBottom: "20px",
};

const greeting = {
  fontSize: "18px",
  lineHeight: "28px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const link = {
  color: "#87CEEB",
  textDecoration: "underline",
};

const signOff = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8c8c8c",
  fontSize: "12px",
};
