let idSeq = 0;

export function toast(message, type = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("tpl-toast", { detail: { id: ++idSeq, message, type } })
  );
}
