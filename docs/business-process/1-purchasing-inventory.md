# Alur Pengadaan & Persediaan Barang (Procurement & Inventory)

```mermaid
graph TD
    %% Actors
    Gudang["Unit Gudang"]
    Admin["Admin Purchasing"]
    Supplier["Supplier"]
    Finance["Unit Keuangan"]

    %% Flow 1: Permintaan Restok
    subgraph "1. Permintaan & Pemesanan"
        Start(("Mulai")) --> ReqRestok["Permintaan Restok (Gudang)"]
        ReqRestok --> CreatePO["Pengajuan PO"]
        CreatePO -- "Status: Pending" --> ConfirmPO["Acc Admin"]

        ConfirmPO -->|Setujui| PrintPO["Cetak PO"]
        ConfirmPO -->|Tolak| RejectPO["PO Ditolak"]
        RejectPO --> EndProc(("Selesai"))

        PrintPO --> SendPO["Kirim PO ke Supplier"]
    end

    %% Flow 2: Penerimaan Barang
    subgraph "2. Penerimaan Barang"
        SendPO -- "Menunggu Pengiriman" --> BarangDatang["Barang Masuk dari Supplier"]
        BarangDatang --> CekKondisi{"Cek Kondisi?"}

        CekKondisi -->|Bagus / Aman| Receive["Terima Barang (Gudang)"]
        CekKondisi -->|Jelek / Rusak| Retur["Retur Barang"]

        Retur -- "Kirim Barang Baru" --> BarangDatang

        Receive --> StatusSelesai["Status PO: Selesai"]
    end

    %% Flow 3: Penagihan & Pembayaran
    subgraph "3. Penagihan & Pembayaran"
        StatusSelesai --> InputInvoice["Input Invoice"]
        InputInvoice --> WaitTempo["Menunggu Jatuh Tempo"]
        WaitTempo --> Pay["Bayar Tagihan"]
        Pay --> UploadProof["Upload Bukti Bayar"]
        UploadProof --> EndAll(("Selesai Traffic"))
    end
```

## Penjelasan Alur

1.  **Permintaan Restok**: Gudang mengajukan via menu PO Barang.
2.  **Konfirmasi**: Admin Acc di menu Konfirmasi PO. Jika oke, status "Diterima" -> PO dicetak & dikirim.
3.  **Barang Masuk**:
    - **Kondisi Bagus**: Diterima Gudang -> Status PO "Selesai".
    - **Kondisi Jelek**: Ajukan Retur -> Tunggu barang pengganti -> Cek ulang -> Diterima.
4.  **Pembayaran**:
    - Status PO Selesai membuka akses untuk **Input Invoice**.
    - Pembayaran dilakukan sesuai Tempo.
    - Bukti bayar diupload untuk menyelesaikan flow.
