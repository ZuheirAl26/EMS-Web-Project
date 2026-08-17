import type { ReviewItem } from "../types/reviewsType";

export function exportReviewsToXlsx(
  reviews: ReviewItem[],
  targetName: string,
  filterRating: number | null,
) {
  if (!reviews || reviews.length === 0) {
    return;
  }

  const dateStr = new Date().toISOString().split("T")[0];
  const filterLabel = filterRating ? `${filterRating}-star` : "all";
  const sanitizedTarget = (targetName || "reviews").replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `reviews_${sanitizedTarget}_${filterLabel}_${dateStr}.xls`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Default">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1F2937"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Center">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1F2937"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Reviews">
  <Table>
   <Column ss:Width="160"/>
   <Column ss:Width="200"/>
   <Column ss:Width="120"/>
   <Column ss:Width="80"/>
   <Column ss:Width="280"/>
   <Column ss:Width="120"/>
   <Row ss:Height="24">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Visitor Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Phone</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Rating</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Comment</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Date</Data></Cell>
   </Row>`;

  reviews.forEach((review) => {
    const visitorName = escapeXml(review.user?.name || "Visitor");
    const email = escapeXml(review.user?.email || "-");
    const phone = escapeXml(review.user?.phone || "-");
    const rating = review.rating || 0;
    const comment = escapeXml(review.comment || "No comment");
    const date = escapeXml(review.created_at ? review.created_at.split("T")[0] : "-");

    xml += `
   <Row ss:Height="20">
    <Cell ss:StyleID="Default"><Data ss:Type="String">${visitorName}</Data></Cell>
    <Cell ss:StyleID="Default"><Data ss:Type="String">${email}</Data></Cell>
    <Cell ss:StyleID="Default"><Data ss:Type="String">${phone}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${rating}</Data></Cell>
    <Cell ss:StyleID="Default"><Data ss:Type="String">${comment}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${date}</Data></Cell>
   </Row>`;
  });

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
