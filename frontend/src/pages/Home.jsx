import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div className="p-10">
        <h1 className="text-4xl font-bold">
          Welcome to JioMart
        </h1>
      </div>
    </>
  );
}

export default Home;