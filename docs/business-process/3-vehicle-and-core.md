# Alur Manajemen Kendaraan & Fitur Core

## 1. Alur Produksi Kendaraan (End-to-End)

```mermaid
graph TD
    %% Actors
    Marketing["Marketing / Project"]
    QC["Quality Control"]
    Prod["Produksi"]
    Admin["Admin"]

    %% Inbound
    subgraph "1. Project & Inbound"
        Start(("Mulai")) --> Offer["Penawaran Harga (Project Customer)"]
        Offer --> Deal{"Deal Project?
        (Harga/Unit x Qty)"}
        Deal -- Ya --> UnitDatang["Unit Kendaraan Masuk"]
        UnitDatang --> QCIn["QC Kendaraan Masuk"]
        QCIn -->|Cek Jumlah & Kondisi| CheckInValid{"Sesuai Perjanjian?"}

        CheckInValid -- Ya --> InputSystem["Input Data Masuk"]
        CheckInValid -- Tidak --> RejectIn["Hold / Konfirmasi Customer"]
    end

    %% Production
    subgraph "2. Proses Produksi"
        InputSystem --> IssueSPK["Turun Surat Perintah Kerja"]
        IssueSPK --> SpekOrder["Distribusi Spek Order"]

        SpekOrder --> TeamRakit["Tukang Rakit: Body & Rangka"]
        SpekOrder --> TeamCat["Tukang Cat: Painting & Finishing"]

        TeamRakit --> Progress{Proses Rakit}
        Progress --> TeamCat
    end

    %% Outbound
    subgraph "3. Outbound"
        TeamCat --> FinProd["Produksi Selesai"]
        FinProd --> QCOut["QC Kendaraan Keluar"]

        QCOut -->|Lolos QC| CetakSJ["Cetak Surat Jalan"]
        QCOut -->|Revisi| Progress

        CetakSJ --> Handover["Serah Terima"]
        Handover --> End(("Selesai"))
    end
```

## 2. Fitur Core: Smart Planning (Hitung Pemakaian Barang)

Fitur ini berada di dalam menu **Project / Penawaran**. Tujuannya untuk mengestimasi modal (HPP) dan kebutuhan material secara otomatis berdasarkan spesifikasi teknis unit.

### Skenario Penggunaan

_User menginput data project baru:_

- **Customer**: PT. Citra Transport Logistic
- **Permintaan**: Wing Box (Hydraulic) - 5 Unit
- **Harga**: Rp 350.000.000 / Unit
- **Spesifikasi Teknis**:
  - Dimensi (PxLxT): 2700 x 2400 x 2750 mm
  - Pintu: 4 Pintu Samping (R/L)
  - Sayap: 4 Sayap

### Alur Sistem (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User as Marketing/Admin
    participant UI as Menu Project
    participant Logic as Calculator Engine
    participant DB as Stok Database

    User->>UI: Input Detail Project & Spesifikasi
    Note right of User: Dimensi, Model, Jumlah Unit

    User->>UI: Klik Tombol "Hitung Pemakaian Barang"

    rect rgb(230, 240, 255)
        UI->>Logic: Kirim Parameter Specs
        Logic->>Logic: Kalkulasi Luas Material (Plat, Besi)
        Logic->>Logic: Kalkulasi Accessories (Engsel, Hydraulic)
        Logic->>Logic: Kalikan dengan Jumlah Unit (x5)
    end

    Logic->>DB: Cek Ketersediaan Stok
    DB-->>Logic: Return Data Stok (Aman/Kurang)

    Logic-->>UI: Tampilkan Hasil Estimasi
    Note over UI: Daftar Material, Estimasi Biaya, & Status Stok
```

### Output Fitur

Sistem akan menampilkan:

1.  **Daftar Material**: Rincian apa saja yang dibutuhkan (misal: Besi UNP 100 20btg, Plat 2mm 10lbr).
2.  **Status Stok**: Indikator apakah stok gudang mencukupi untuk project ini.
3.  **Rekomendasi**: Jika stok kurang, tombol untuk _Generate PO_ ke purchasing akan aktif otomatis.
