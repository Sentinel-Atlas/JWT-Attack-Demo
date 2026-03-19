import { useState } from "react";
import { AttackReport } from "../types/jwt";
import { AlgNoneAttack } from "./AlgNoneAttack";
import { BruteForceAttack } from "./BruteForceAttack";
import { ReplayAttack } from "./ReplayAttack";

export function AttackPanel({ report }: { report: AttackReport | null }) {
  const [tab, setTab] = useState<"alg" | "brute" | "replay">("alg");
  if (!report) return <div className="panel">Run analysis to view attack results.</div>;

  return (
    <div>
      <div className="tabs">
        <button className={tab === "alg" ? "active" : ""} onClick={() => setTab("alg")}>ALG:NONE</button>
        <button className={tab === "brute" ? "active" : ""} onClick={() => setTab("brute")}>BRUTE FORCE</button>
        <button className={tab === "replay" ? "active" : ""} onClick={() => setTab("replay")}>REPLAY</button>
      </div>
      {tab === "alg" && <AlgNoneAttack result={report.algNone} />}
      {tab === "brute" && <BruteForceAttack result={report.bruteForce} />}
      {tab === "replay" && <ReplayAttack result={report.replay} />}
    </div>
  );
}
