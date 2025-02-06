import { authSession } from "@/lib/dal";
import Client from "./components/client";

const HomePage = async () => {
  const user = await authSession();
  return <Client user={user} />;
};

export default HomePage;
