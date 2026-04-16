import Header from "./Header";
import NovisKitchenPage from "./NovisKitchenMenu";
import Footer from "./Footer";
import "./index.css";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <NovisKitchenPage />
      </main>
      <Footer />
    </div>
  );
}
