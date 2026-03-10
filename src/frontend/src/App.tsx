import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Building2,
  CirclePlus,
  Database,
  FileText,
  LayoutGrid,
  Pencil,
  Printer,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Record_ } from "./backend.d";
import {
  useAddRecord,
  useDeleteRecord,
  useGetAllRecords,
  useUpdateRecord,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

type FormData = {
  finance: string;
  customerName: string;
  mcf: string;
  product: string;
  loanAmount: string;
  grossAmount: string;
  netAmount: string;
  brokerageAmountReceivedDate: string;
  bankAmountReceivedDate: string;
  remark: string;
};

const emptyForm: FormData = {
  finance: "",
  customerName: "",
  mcf: "",
  product: "",
  loanAmount: "",
  grossAmount: "",
  netAmount: "",
  brokerageAmountReceivedDate: "",
  bankAmountReceivedDate: "",
  remark: "",
};

function formatDate(val: string | undefined | null): string {
  if (!val) return "";
  return val;
}

function printSingleRecord(rec: Record_, srNo: number) {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Brokerage Record #${srNo}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; margin: 32px; }
        .header { text-align: center; border-bottom: 2px solid #1a2744; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; font-weight: bold; color: #1a2744; margin: 0; }
        .header p { font-size: 11px; color: #555; margin: 4px 0 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background-color: #1a2744; color: white; text-align: left; padding: 8px 10px; font-size: 11px; }
        td { padding: 8px 10px; border: 1px solid #ccc; font-size: 12px; }
        tr:nth-child(even) td { background-color: #f5f5f5; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
        .received { background: #dcfce7; color: #166534; }
        .pending { background: #fef9c3; color: #854d0e; }
        .footer { margin-top: 24px; font-size: 10px; color: #888; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>URBAN MONEY BROKERAGE</h1>
        <p>Brokerage Management System — Individual Record</p>
        <p>Printed on: ${dateStr}</p>
      </div>
      <table>
        <tr><th colspan="2">Record Details — Sr. No. ${srNo}</th></tr>
        <tr><td><strong>Finance</strong></td><td>${rec.finance}</td></tr>
        <tr><td><strong>Customer Name</strong></td><td>${rec.customerName}</td></tr>
        <tr><td><strong>MCF</strong></td><td>${rec.mcf}</td></tr>
        <tr><td><strong>Product</strong></td><td>${rec.product}</td></tr>
        <tr><td><strong>Loan Amount</strong></td><td>${rec.loanAmount || "—"}</td></tr>
        <tr><td><strong>Gross Amount</strong></td><td>${rec.grossAmount || "—"}</td></tr>
        <tr><td><strong>Net Amount</strong></td><td>${rec.netAmount || "—"}</td></tr>
        <tr><td><strong>Brokerage Amt Received Date</strong></td><td>${rec.brokerageAmountReceivedDate || "—"}</td></tr>
        <tr><td><strong>Bank Amt Received Date</strong></td><td>${rec.bankAmountReceivedDate || "—"}</td></tr>
        <tr><td><strong>Remark</strong></td><td><span class="badge ${rec.remark === "Received" ? "received" : "pending"}">${rec.remark}</span></td></tr>
      </table>
      <div class="footer">Urban Money Brokerage — Confidential</div>
    </body>
    </html>
  `;
  const win = window.open("", "_blank", "width=700,height=600");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }
}

function AddBrokerageForm({
  onSuccess,
  nextSerialNumber,
}: {
  onSuccess: () => void;
  nextSerialNumber: number;
}) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const addRecord = useAddRecord();

  const set =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClear = () => setForm(emptyForm);

  const handlePrintBlank = () => {
    window.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.finance || !form.customerName || !form.mcf || !form.product) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await addRecord.mutateAsync({
        brokerageAmountReceivedDate: form.brokerageAmountReceivedDate || null,
        bankAmountReceivedDate: form.bankAmountReceivedDate || null,
        finance: form.finance,
        customerName: form.customerName,
        mcf: form.mcf,
        product: form.product,
        loanAmount: form.loanAmount,
        grossAmount: form.grossAmount,
        netAmount: form.netAmount,
        remark: form.remark || "Pending",
      });
      toast.success("Brokerage record saved successfully");
      setForm(emptyForm);
      onSuccess();
    } catch {
      toast.error("Failed to save record");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Card header with amber left border */}
      <div className="border-l-4 border-amber-500 pl-5 pr-6 pt-5 pb-4 flex items-start justify-between border-b border-gray-100">
        <div>
          <h2 className="text-xl font-display font-bold text-[#0d1b2a]">
            New Brokerage Entry
          </h2>
          <p className="text-sm text-blue-600 mt-0.5">
            Fill in the details to create a new brokerage record
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center bg-[#0d1b2a] text-white text-xs font-bold px-3 py-1.5 rounded-md">
            S/N: #{nextSerialNumber}
          </span>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {/* Row 1: Serial Number | Finance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Serial Number
            </Label>
            <Input
              value={`Auto-assigned: #${nextSerialNumber}`}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="finance"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Finance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="finance"
              placeholder="Enter finance company"
              value={form.finance}
              onChange={set("finance")}
              data-ocid="form.finance.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>

          {/* Row 2: Customer Name | MCF */}
          <div className="space-y-1.5">
            <Label
              htmlFor="customerName"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Customer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              value={form.customerName}
              onChange={set("customerName")}
              data-ocid="form.customer_name.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="mcf"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              MCF <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mcf"
              placeholder="Enter MCF number"
              value={form.mcf}
              onChange={set("mcf")}
              data-ocid="form.mcf.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>

          {/* Row 3: Product | Gross Amount */}
          <div className="space-y-1.5">
            <Label
              htmlFor="product"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Product <span className="text-red-500">*</span>
            </Label>
            <Input
              id="product"
              placeholder="Enter product type"
              value={form.product}
              onChange={set("product")}
              data-ocid="form.product.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="grossAmount"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Gross Amount
            </Label>
            <Input
              id="grossAmount"
              placeholder="Enter gross amount"
              value={form.grossAmount}
              onChange={set("grossAmount")}
              data-ocid="form.gross_amount.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>

          {/* Row 4: Net Amount | Loan Amount */}
          <div className="space-y-1.5">
            <Label
              htmlFor="netAmount"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Net Amount
            </Label>
            <Input
              id="netAmount"
              placeholder="Enter net amount"
              value={form.netAmount}
              onChange={set("netAmount")}
              data-ocid="form.net_amount.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="loanAmount"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Loan Amount{" "}
              <span className="normal-case font-normal text-gray-400">
                (Optional)
              </span>
            </Label>
            <Input
              id="loanAmount"
              placeholder="Enter loan amount"
              value={form.loanAmount}
              onChange={set("loanAmount")}
              data-ocid="form.loan_amount.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>

          {/* Row 5: Brokerage Date | Bank Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor="brokerageDate"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Brokerage Amt. Received Date{" "}
              <span className="normal-case font-normal text-gray-400">
                (Optional)
              </span>
            </Label>
            <Input
              id="brokerageDate"
              type="date"
              value={form.brokerageAmountReceivedDate}
              onChange={set("brokerageAmountReceivedDate")}
              data-ocid="form.brokerage_date.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="bankDate"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Bank Amt. Received Date{" "}
              <span className="normal-case font-normal text-gray-400">
                (Optional)
              </span>
            </Label>
            <Input
              id="bankDate"
              type="date"
              value={form.bankAmountReceivedDate}
              onChange={set("bankAmountReceivedDate")}
              data-ocid="form.bank_date.input"
              className="bg-gray-50 border-gray-200 focus:border-[#0d1b2a] focus:ring-[#0d1b2a]/10"
            />
          </div>

          {/* Row 6: Remark */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Remark
            </Label>
            <Select
              value={form.remark}
              onValueChange={(v) => setForm((prev) => ({ ...prev, remark: v }))}
            >
              <SelectTrigger
                data-ocid="form.remark.select"
                className="bg-gray-50 border-gray-200"
              >
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            data-ocid="form.clear.button"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrintBlank}
            data-ocid="form.print.button"
            className="border-amber-400 text-amber-600 hover:bg-amber-50 gap-1.5"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            type="submit"
            disabled={addRecord.isPending}
            data-ocid="form.save.submit_button"
            className="bg-[#0d1b2a] hover:bg-[#1a2f4a] text-white gap-1.5 px-5"
          >
            {addRecord.isPending ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CirclePlus className="h-4 w-4" />
                Save Record
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

type FilterType = "All" | "Received" | "Pending";

function RecordsTable() {
  const { data: records = [], isLoading } = useGetAllRecords();
  const deleteRecord = useDeleteRecord();
  const updateRecord = useUpdateRecord();

  const [filter, setFilter] = useState<FilterType>("All");
  const [editRecord, setEditRecord] = useState<Record_ | null>(null);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const sorted = [...records].sort((a, b) => Number(a.id) - Number(b.id));
  const filtered = sorted.filter((r) => {
    if (filter === "All") return true;
    return r.remark === filter;
  });

  const openEdit = (rec: Record_) => {
    setEditRecord(rec);
    setEditForm({
      finance: rec.finance,
      customerName: rec.customerName,
      mcf: rec.mcf,
      product: rec.product,
      loanAmount: rec.loanAmount,
      grossAmount: rec.grossAmount,
      netAmount: rec.netAmount,
      brokerageAmountReceivedDate: rec.brokerageAmountReceivedDate ?? "",
      bankAmountReceivedDate: rec.bankAmountReceivedDate ?? "",
      remark: rec.remark,
    });
  };

  const handleEditSave = async () => {
    if (!editRecord) return;
    try {
      await updateRecord.mutateAsync({
        id: editRecord.id,
        brokerageAmountReceivedDate:
          editForm.brokerageAmountReceivedDate || null,
        bankAmountReceivedDate: editForm.bankAmountReceivedDate || null,
        finance: editForm.finance,
        customerName: editForm.customerName,
        mcf: editForm.mcf,
        product: editForm.product,
        loanAmount: editForm.loanAmount,
        grossAmount: editForm.grossAmount,
        netAmount: editForm.netAmount,
        remark: editForm.remark,
        createdAt: editRecord.createdAt,
      });
      toast.success("Record updated successfully");
      setEditRecord(null);
    } catch {
      toast.error("Failed to update record");
    }
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteRecord.mutateAsync(deleteTarget);
      toast.success("Record deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete record");
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  const setEditField =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setEditForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-4">
      {/* Print header — only visible when printing */}
      <div className="print-header">
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid #1a2744",
            paddingBottom: "12px",
            marginBottom: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1a2744",
              margin: 0,
            }}
          >
            URBAN MONEY BROKERAGE
          </h1>
          <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 0" }}>
            Brokerage Management System — Records Report
          </p>
          <p style={{ fontSize: "11px", color: "#555", margin: "4px 0 0" }}>
            Date:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          {filter !== "All" && (
            <p style={{ fontSize: "11px", color: "#555", margin: "4px 0 0" }}>
              Filter: {filter} Records
            </p>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 mr-1">
            Filter by:
          </span>
          {(["All", "Received", "Pending"] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-ocid={
                f === "All"
                  ? "records.filter_all.tab"
                  : f === "Received"
                    ? "records.filter_received.tab"
                    : "records.filter_pending.tab"
              }
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-[#0d1b2a] text-white shadow-sm"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintAll}
          data-ocid="records.print.button"
          className="flex items-center gap-2 border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white transition-all"
        >
          <Printer className="h-4 w-4" />
          Print All
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm text-gray-500 no-print">
        <span>
          Total: <strong className="text-gray-800">{filtered.length}</strong>{" "}
          records
        </span>
        <span>
          Received:{" "}
          <strong className="text-green-700">
            {sorted.filter((r) => r.remark === "Received").length}
          </strong>
        </span>
        <span>
          Pending:{" "}
          <strong className="text-amber-700">
            {sorted.filter((r) => r.remark === "Pending").length}
          </strong>
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="records.loading_state"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-gray-200 border-t-[#0d1b2a] rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading records...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50"
          data-ocid="records.empty_state"
        >
          <FileText className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-base font-semibold text-gray-500">
            No records found
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === "All"
              ? "Add your first brokerage record to get started"
              : `No ${filter} records found`}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
          <Table data-ocid="records.table">
            <TableHeader>
              <TableRow className="bg-[#0d1b2a] hover:bg-[#0d1b2a]">
                {[
                  "Sr. No.",
                  "Brokerage Amt\nReceived Date",
                  "Bank Amt\nReceived Date",
                  "Finance",
                  "Customer Name",
                  "MCF",
                  "Product",
                  "Loan Amount",
                  "Gross Amount",
                  "Net Amount",
                  "Remark",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-white font-semibold text-xs whitespace-pre-line py-3 px-3 border-r border-white/10 last:border-r-0"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec, idx) => (
                <TableRow
                  key={String(rec.id)}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  data-ocid={`records.row.${idx + 1}`}
                >
                  <TableCell className="font-bold text-[#0d1b2a] text-center px-3 py-2.5 text-sm">
                    {String(rec.id)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-center">
                    {formatDate(rec.brokerageAmountReceivedDate) || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-center">
                    {formatDate(rec.bankAmountReceivedDate) || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm font-medium">
                    {rec.finance}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm">
                    {rec.customerName}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm">
                    {rec.mcf}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm">
                    {rec.product}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-right">
                    {rec.loanAmount || <span className="text-gray-300">—</span>}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-right">
                    {rec.grossAmount || (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-right">
                    {rec.netAmount || <span className="text-gray-300">—</span>}
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <Badge
                      className={
                        rec.remark === "Received"
                          ? "badge-received bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                          : "badge-pending bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                      }
                      variant="outline"
                    >
                      {rec.remark}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 no-print">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(rec)}
                        data-ocid={`records.edit_button.${idx + 1}`}
                        className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => printSingleRecord(rec, idx + 1)}
                        data-ocid={`records.print_button.${idx + 1}`}
                        className="h-7 w-7 p-0 text-[#0d1b2a] hover:text-[#1a2f4a] hover:bg-blue-50"
                        title="Print this record"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(rec.id)}
                        data-ocid={`records.delete_button.${idx + 1}`}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editRecord}
        onOpenChange={(o) => !o && setEditRecord(null)}
      >
        <DialogContent className="max-w-2xl" data-ocid="edit.dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-display font-bold text-[#0d1b2a]">
              Edit Brokerage Record
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {(
              [
                ["finance", "Finance"],
                ["customerName", "Customer Name"],
                ["mcf", "MCF"],
                ["product", "Product"],
                ["loanAmount", "Loan Amount"],
                ["grossAmount", "Gross Amount"],
                ["netAmount", "Net Amount"],
              ] as [keyof FormData, string][]
            ).map(([field, label]) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-sm font-semibold">{label}</Label>
                <Input value={editForm[field]} onChange={setEditField(field)} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">
                Brokerage Amt Received Date
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </Label>
              <Input
                type="date"
                value={editForm.brokerageAmountReceivedDate}
                onChange={setEditField("brokerageAmountReceivedDate")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">
                Bank Amt Received Date
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </Label>
              <Input
                type="date"
                value={editForm.bankAmountReceivedDate}
                onChange={setEditField("bankAmountReceivedDate")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Remark</Label>
              <Select
                value={editForm.remark}
                onValueChange={(v) =>
                  setEditForm((prev) => ({ ...prev, remark: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditRecord(null)}
              data-ocid="edit.cancel.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={updateRecord.isPending}
              data-ocid="edit.save.submit_button"
              className="bg-[#0d1b2a] hover:bg-[#1a2f4a] text-white"
            >
              {updateRecord.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brokerage record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete.cancel.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="delete.confirm.confirm_button"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<"add" | "records">("add");
  const { data: records = [] } = useGetAllRecords();
  const nextSerialNumber = records.length + 1;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f0f2f5" }}
    >
      {/* Header */}
      <header
        className="no-print shadow-lg"
        style={{ backgroundColor: "#0d1b2a" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center h-12 w-12 rounded-lg"
                style={{ backgroundColor: "#1a2f4a" }}
              >
                <Building2 className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                  Urban Money Brokerage
                </h1>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mt-0.5"
                  style={{ color: "#8ba3c7" }}
                >
                  Financial Records Management System
                </p>
              </div>
            </div>

            {/* Right: Record count */}
            <div className="flex items-center gap-3 no-print">
              <div
                className="w-px h-8"
                style={{ backgroundColor: "#2a3f5c" }}
              />
              <div className="flex items-center gap-2 text-white">
                <Database className="h-4 w-4" style={{ color: "#8ba3c7" }} />
                <span className="text-sm font-semibold">
                  {records.length}{" "}
                  <span style={{ color: "#8ba3c7" }}>Records</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Custom pill tabs */}
        <div className="flex gap-3 mb-5 no-print">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            data-ocid="nav.add_tab"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              activeTab === "add"
                ? "text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            style={activeTab === "add" ? { backgroundColor: "#0d1b2a" } : {}}
          >
            <CirclePlus className="h-4 w-4" />
            Add New Brokerage
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("records")}
            data-ocid="nav.records_tab"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              activeTab === "records"
                ? "text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            style={
              activeTab === "records" ? { backgroundColor: "#0d1b2a" } : {}
            }
          >
            <LayoutGrid className="h-4 w-4" />
            All Records
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "add" && (
          <AddBrokerageForm
            onSuccess={() => setActiveTab("records")}
            nextSerialNumber={nextSerialNumber}
          />
        )}

        {activeTab === "records" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="border-l-4 border-amber-500 pl-4 mb-5 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-display font-bold text-[#0d1b2a]">
                Brokerage Records
              </h2>
              <p className="text-sm text-blue-600 mt-0.5">
                View, manage, and print all brokerage records
              </p>
            </div>
            <RecordsTable />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="mt-auto py-4 border-t border-gray-200 no-print"
        style={{ backgroundColor: "#f0f2f5" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Urban Money Brokerage. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
