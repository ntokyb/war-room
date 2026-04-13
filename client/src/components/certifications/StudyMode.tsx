import { useMemo, useState } from "react";
import { AZ900_FLASHCARDS } from "../../constants/az900Flashcards";
import type { Flashcard, FlashcardDifficulty } from "../../constants/az900Flashcards";
import { CERT_ROADMAP } from "../../constants/certRoadmap";
import type { MasteryMap } from "./certStorage";
import { filterBtnStyle } from "../../theme/tokens";

const FLASHCARDS_BY_CERT: Record<string, Flashcard[]> = {
  az900: AZ900_FLASHCARDS,
};

type StudyModeProps = {
  certId: string;
  onCertIdChange: (id: string) => void;
  mastery: MasteryMap;
  onMasteryChange: (next: MasteryMap) => void;
};

const AZURE_ACCENT = "#0078d4";

export default function StudyMode({
  certId,
  onCertIdChange,
  mastery,
  onMasteryChange,
}: StudyModeProps) {
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<FlashcardDifficulty | "all">("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const bank = useMemo(() => FLASHCARDS_BY_CERT[certId] ?? [], [certId]);

  const topics = useMemo(() => {
    const s = new Set<string>();
    bank.forEach((c) => s.add(c.topic));
    return ["all", ...[...s].sort()];
  }, [bank]);

  const difficulties: (FlashcardDifficulty | "all")[] = ["all", "Easy", "Medium", "Hard"];

  const filtered = useMemo(() => {
    return bank.filter((c) => {
      if (topicFilter !== "all" && c.topic !== topicFilter) return false;
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [bank, topicFilter, difficultyFilter]);

  const card = filtered[index] ?? null;
  const masteredSet = new Set(mastery[certId] ?? []);
  const masteredCount = bank.filter((c) => masteredSet.has(c.id)).length;

  const setMastered = (questionId: number, value: boolean) => {
    const list = new Set(mastery[certId] ?? []);
    if (value) list.add(questionId);
    else list.delete(questionId);
    onMasteryChange({
      ...mastery,
      [certId]: [...list].sort((a, b) => a - b),
    });
  };

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => {
      if (!filtered.length) return 0;
      return (i - 1 + filtered.length) % filtered.length;
    });
  };

  if (!bank.length) {
    return (
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "32px",
          background: "#0d0d16",
          border: "1px solid #1e1e30",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 16px 0" }}>
          Flashcards for this certification are not loaded yet. AZ-900 is ready now; more exams will be
          added over time.
        </p>
        <label style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "8px" }}>
          Preview roadmap entry
        </label>
        <select
          value={certId}
          onChange={(e) => onCertIdChange(e.target.value)}
          style={{
            background: "#111118",
            border: "1px solid #2a2a3e",
            color: "#ccc",
            padding: "10px 14px",
            borderRadius: "6px",
            fontFamily: "inherit",
            fontSize: "12px",
          }}
        >
          {CERT_ROADMAP.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.fullName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#666", marginBottom: "6px" }}>CERT</div>
          <select
            value={certId}
            onChange={(e) => {
              onCertIdChange(e.target.value);
              setIndex(0);
              setFlipped(false);
              setTopicFilter("all");
              setDifficultyFilter("all");
            }}
            style={{
              background: "#111118",
              border: `1px solid ${AZURE_ACCENT}44`,
              color: "#e0e0f0",
              padding: "10px 14px",
              borderRadius: "6px",
              fontFamily: "inherit",
              fontSize: "12px",
              minWidth: "200px",
            }}
          >
            {CERT_ROADMAP.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#666", marginBottom: "6px" }}>TOPIC</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTopicFilter(t);
                  setIndex(0);
                  setFlipped(false);
                }}
                style={filterBtnStyle(topicFilter === t, AZURE_ACCENT)}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#666", marginBottom: "6px" }}>
            DIFFICULTY
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {difficulties.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDifficultyFilter(d);
                  setIndex(0);
                  setFlipped(false);
                }}
                style={filterBtnStyle(difficultyFilter === d, AZURE_ACCENT)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
        Progress:{" "}
        <span style={{ color: AZURE_ACCENT, fontWeight: 700 }}>
          {masteredCount}/{bank.length}
        </span>{" "}
        mastered · Showing card {filtered.length ? index + 1 : 0}/{filtered.length} in filter
      </div>

      {!card ? (
        <p style={{ color: "#ff9f00", fontSize: "12px" }}>No cards match these filters.</p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            style={{
              width: "100%",
              minHeight: "200px",
              background: "#0d0d16",
              border: `1px solid ${AZURE_ACCENT}55`,
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              color: "#e0e0f0",
            }}
          >
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: AZURE_ACCENT, marginBottom: "12px" }}>
              {flipped ? "ANSWER" : "QUESTION"} · {card.topic} · {card.difficulty}
              {masteredSet.has(card.id) ? " · ✓ mastered" : ""}
            </div>
            <div style={{ fontSize: "14px", lineHeight: 1.7, color: flipped ? "#a8d8a8" : "#ddd" }}>
              {flipped ? card.answer : card.question}
            </div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "20px" }}>Tap card to flip</div>
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "18px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={goPrev}
                style={{
                  background: "#111118",
                  border: "1px solid #2a2a3e",
                  color: "#888",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "11px",
                }}
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={goNext}
                style={{
                  background: "#111118",
                  border: "1px solid #2a2a3e",
                  color: "#888",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "11px",
                }}
              >
                Next →
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                disabled={!flipped}
                onClick={() => {
                  setMastered(card.id, true);
                  goNext();
                }}
                style={{
                  background: flipped ? "#00ff8822" : "#1a1a28",
                  border: `1px solid ${flipped ? "#00ff88" : "#333"}`,
                  color: flipped ? "#00ff88" : "#444",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  cursor: flipped ? "pointer" : "default",
                  fontFamily: "inherit",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Got it
              </button>
              <button
                type="button"
                disabled={!flipped}
                onClick={() => {
                  setMastered(card.id, false);
                  goNext();
                }}
                style={{
                  background: flipped ? "#ff9f0022" : "#1a1a28",
                  border: `1px solid ${flipped ? "#ff9f00" : "#333"}`,
                  color: flipped ? "#ff9f00" : "#444",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  cursor: flipped ? "pointer" : "default",
                  fontFamily: "inherit",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Review again
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
