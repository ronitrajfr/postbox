import { Header } from "~/components/header";
import { RequestForm } from "~/components/request-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
      <div className="container mx-auto max-w-4xl">
        <Header />
        <RequestForm />
      </div>
    </main>
  );
}
