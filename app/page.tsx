import Spreadsheet from "./components/Spreadsheet"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-4">
          Realtime Spreadsheet
        </h1>

        <Spreadsheet />

      </div>

    </main>
  )
}