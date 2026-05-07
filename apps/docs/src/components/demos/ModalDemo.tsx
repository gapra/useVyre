import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@usevyre/react";

export function ModalBasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Confirm deletion</h2>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.75 }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export function ModalSizesDemo() {
  const [size, setSize] = useState<"sm" | "md" | "lg" | null>(null);
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {(["sm", "md", "lg"] as const).map((s) => (
        <Button key={s} variant="secondary" onClick={() => setSize(s)}>
          {s.toUpperCase()}
        </Button>
      ))}
      <Modal open={size !== null} onClose={() => setSize(null)} size={size ?? "md"}>
        <ModalHeader>
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
            Size: {size?.toUpperCase()}
          </h2>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.75 }}>
            This modal uses <code>size="{size}"</code>.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="accent" onClick={() => setSize(null)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
