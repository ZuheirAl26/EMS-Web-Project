import "./Skeleton.scss";

interface SkeletonProps {
  borderRadius?: string;
  className?: string;
  height?: string | number;
  width?: string | number;
}

export function Skeleton({
  borderRadius,
  className = "",
  height = 14,
  width = "100%",
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
      }}
    />
  );
}
