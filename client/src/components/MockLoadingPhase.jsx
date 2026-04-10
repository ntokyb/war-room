import LoadingSpinner from "./LoadingSpinner.jsx";

export default function MockLoadingPhase({ loadingProgress, count }) {
  return (
    <main
      style={{
        maxWidth: "620px",
        margin: "0 auto",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <LoadingSpinner />
      <div style={{ marginTop: "24px", fontSize: "14px", color: "#888" }}>
        Generating problems... {loadingProgress}/{count}
      </div>
      <div
        style={{
          marginTop: "16px",
          background: "#1e1e30",
          borderRadius: "4px",
          height: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(loadingProgress / count) * 100}%`,
            height: "100%",
            background: "#00ff88",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </main>
  );
}
