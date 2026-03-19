export function MitreTag({ technique, name }: { technique: string; name: string }) {
  return (
    <a className="mitre-tag" href={`https://attack.mitre.org/techniques/${technique}`} target="_blank" rel="noreferrer">
      [ATT&CK] {technique} · {name}
    </a>
  );
}
