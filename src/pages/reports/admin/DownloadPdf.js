import jsPDF from 'jspdf';
import moment from 'moment';
import autoTable from 'jspdf-autotable';

const PDFreport = ( reportData, startDate, endDate ) => {
  console.log(reportData)
  const unit = 'pt';
  const size = 'A4'; // Use A1, A2, A3 or A4
  const orientation = 'portrait'; // portrait or landscape
  const marginLeft = 10;
  // eslint-disable-next-line new-cap
  const document = new jsPDF(orientation, unit, size);

  const headers = [
    [
      'DATE',
      'TCT',
      'VIOLATOR',
      'VIOLATIONS',
      'ADDRESS',
      'AMOUNT',
      'LICENSE#',
      'PLATE#',
      'STATUS',
    ],
  ];

  const data = reportData?.data?.map((report) => [
    moment(report?.citation?.created_at).format("MM-DD-YYYY") || "",
    report?.citation?.tct || "",
    report?.citation ? `${report?.citation?.violator.first_name} ${report?.citation?.violator.middle_name} ${report?.citation?.violator.last_name}` : "",
    report?.citation ? report.violations.map((data) => data.violation_name) : "",
    report?.citation ? `${report?.citation?.violator.street}, ${report?.citation?.violator.barangay}, ${report?.citation?.violator.municipality}` : "",
    report.sub_total,
    report?.citation?.license.license_number ? report?.citation?.license.license_number : "N/A",
    report?.citation?.vehicle.plate_number ? report?.citation?.vehicle.plate_number : "N/A",
    report.expired === 'yes' ? "Unsettled" : "Settled",
  ]);

  const content = {
    theme: 'grid',
    startY: 130,
    head: headers,
    body: data,
    margin: { left: 10, right: 10, top: 5 },
    headStyles: {
      halign: 'center',
      fillColor: '#41B6E6',
      valign: 'middle',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 61, halign: 'center', valign: 'middle', fontSize: 8 },
      1: { cellWidth: 51, halign: 'center', valign: 'middle', fontSize: 8 },
      2: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      3: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      4: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      5: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      6: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      7: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
      8: { cellWidth: 66, halign: 'center', valign: 'middle', fontSize: 8 },
    },
    didDrawPage: () => {
      // Footer
      // @ts-ignore
      const pageCount = document.internal.getNumberOfPages();
      document.text(`Page ${  String(pageCount)}`, 10, document.internal.pageSize.height - 10);
    },
  };
  // Header
  document.setFontSize(10);
  document.text('UNSETTLED VIOLATION REPORT', marginLeft, 70);
  document.text('Admin', marginLeft, 85);
  document.text(
    `Report from ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}`,
    marginLeft,
    115
  );
  document.addImage(
    "static/rtmo_logo.png",
    "png",
    marginLeft,
    5,
    100,
    50
  );

  // @ts-ignore
  autoTable(document, content);
  return document.save(
    `Unsettled-Violations-${moment(startDate).format('MM-DD-YYYY')}-to-${moment(endDate).format('MM-DD-YYYY')}.pdf`
  );
};

export default PDFreport;
