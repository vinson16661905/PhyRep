import { useCanvasStore } from "../store/useCanvasStore";
import type { ReportMeta } from "../types/blocks";

const metaFields: { key: keyof ReportMeta; label: string; multiline?: boolean }[] = [
  { key: "experiment", label: "实验名称" },
  { key: "student", label: "学生" },
  { key: "student_id", label: "学号" },
  { key: "date", label: "日期" },
];

export const MetadataPanel = () => {
  const meta = useCanvasStore((state) => state.meta);
  const setMeta = useCanvasStore((state) => state.setMeta);

  return (
    <div className="panel">
      <h2>报告元数据</h2>
      <div className="metadata-grid">
        {metaFields.map((field) => (
          <label key={field.key}>
            {field.label}
            {field.multiline ? (
              <textarea
                value={(meta[field.key] as string) ?? ""}
                onChange={(event) => setMeta({ [field.key]: event.target.value })}
              />
            ) : (
              <input
                type={field.key === "date" ? "date" : "text"}
                value={(meta[field.key] as string) ?? ""}
                onChange={(event) => setMeta({ [field.key]: event.target.value })}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
};
