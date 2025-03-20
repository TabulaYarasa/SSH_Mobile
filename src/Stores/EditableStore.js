import { create } from "zustand";

const EditableStore = create ((set) => ({
    editable: "",
   setEditable: (value) => set((state) => ({editable: value})),
}))

export default EditableStore