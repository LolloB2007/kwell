const fmt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const formatPrice = (n: number) => fmt.format(n);
