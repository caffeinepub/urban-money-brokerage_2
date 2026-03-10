import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Record_ {
    id: bigint;
    mcf: string;
    remark: string;
    customerName: string;
    netAmount: string;
    finance: string;
    loanAmount: string;
    createdAt: bigint;
    grossAmount: string;
    bankAmountReceivedDate?: string;
    brokerageAmountReceivedDate?: string;
    product: string;
}
export interface backendInterface {
    addRecord(brokerageAmountReceivedDate: string | null, bankAmountReceivedDate: string | null, finance: string, customerName: string, mcf: string, product: string, loanAmount: string, grossAmount: string, netAmount: string, remark: string, createdAt: bigint): Promise<bigint>;
    deleteRecord(id: bigint): Promise<void>;
    getAllRecords(): Promise<Array<Record_>>;
    getRecord(id: bigint): Promise<Record_>;
    updateRecord(id: bigint, brokerageAmountReceivedDate: string | null, bankAmountReceivedDate: string | null, finance: string, customerName: string, mcf: string, product: string, loanAmount: string, grossAmount: string, netAmount: string, remark: string, createdAt: bigint): Promise<void>;
}
