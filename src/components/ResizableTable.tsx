"use client";

import { useCallback, useRef, useState } from "react";

const LONG_FIELD_RE = /product title|^serial$|^old serial$|^old sn$|remarks/i;

type ResizableTableProps = {
  columns: string[];
  rows: string[][];
  colWidths: Record<string, number>;
  onColResize: (colName: string, width: number) => void;
};

export default function ResizableTable({
  columns,
  rows,
  colWidths,
  onColResize,
}: ResizableTableProps) {
  const [bodyHeight, setBodyHeight] = useState(48);
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const resizingCol = useRef<{ colName: string; startX: number; startWidth: number } | null>(null);
  const resizingRow = useRef<{ startY: number; startHeight: number } | null>(null);

  const onColResizeStart = useCallback(
    (colName: string, e: React.MouseEvent) => {
      e.preventDefault();
      const th = (e.target as HTMLElement).closest("th");
      const currentWidth = th ? th.getBoundingClientRect().width : colWidths[colName] || 150;
      setDraggingCol(colName);
      resizingCol.current = { colName, startX: e.clientX, startWidth: currentWidth };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizingCol.current) return;
        const diff = ev.clientX - resizingCol.current.startX;
        const newWidth = Math.max(80, resizingCol.current.startWidth + diff);
        onColResize(resizingCol.current.colName, newWidth);
      };

      const onMouseUp = () => {
        resizingCol.current = null;
        setDraggingCol(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onColResize],
  );

  const onRowResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizingRow.current = { startY: e.clientY, startHeight: bodyHeight };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizingRow.current) return;
        const diff = ev.clientY - resizingRow.current.startY;
        const newHeight = Math.max(48, Math.min(600, resizingRow.current.startHeight + diff));
        setBodyHeight(newHeight);
      };

      const onMouseUp = () => {
        resizingRow.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [bodyHeight],
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {columns.map((col) => (
            <col key={col} style={colWidths[col] ? { width: colWidths[col] } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th
                key={col}
                title={col}
                className="group relative whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                <span className="pr-2">{col}</span>
                <span
                  onMouseDown={(e) => onColResizeStart(col, e)}
                  className={`absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize bg-transparent transition-colors hover:bg-slate-300 ${draggingCol === col ? "!z-50" : ""}`}
                />
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div className="relative overflow-y-auto" style={{ maxHeight: bodyHeight }}>
        <table className="w-full text-left" style={{ tableLayout: "fixed" }}>
          <colgroup>
            {columns.map((col) => (
              <col key={col} style={colWidths[col] ? { width: colWidths[col] } : undefined} />
            ))}
          </colgroup>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors hover:bg-slate-50/80">
                {row.map((cell, cellIndex) => {
                  const colName = columns[cellIndex];
                  const isInvField = colName?.includes("Inv");
                  const isLongField = LONG_FIELD_RE.test(colName);

                  return (
                    <td
                      key={cellIndex}
                      title={isLongField ? cell : undefined}
                      className={`px-4 py-2.5 text-left text-sm text-slate-600 ${isLongField ? "overflow-hidden text-ellipsis whitespace-nowrap" : "whitespace-nowrap"}`}
                    >
                      {isInvField ? (
                        <a
                          href={`/search/${cell}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-800 hover:decoration-blue-400"
                        >
                          {cell}
                        </a>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <span
          onMouseDown={onRowResizeStart}
          className="sticky bottom-0 left-0 block h-1 w-full cursor-row-resize bg-slate-100 transition-colors hover:bg-slate-300"
        />
      </div>
    </div>
  );
}
