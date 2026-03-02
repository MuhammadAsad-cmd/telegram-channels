import CpLayoutClient from "./CpLayoutClient";


export const metadata = {
  title: "Control Panel - Telegram Channels",
  description: "Manage your Telegram channels and media",
};

export default function CpLayout({ children }) {
  return <CpLayoutClient>{children}</CpLayoutClient>;
}
