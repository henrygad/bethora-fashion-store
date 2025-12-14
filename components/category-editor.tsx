
"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Controller from "@/lib/firebase/controler";

export default function CategoryCreator({
    onCreated,
}: {
    onCreated: (cat: { id: string, name: string }) => void;
}) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Category name required");
            return;
        }
        setLoading(true);
        try {

            const payload = {
                name: name.trim(),
            }

            // create new cat
            const id = await Controller.createData("categories", payload);
            const cat = await Controller.getData<{ id: string, name: string }>("categories", id);

            setName("");
            toast.success("Category created");
            if (onCreated) onCreated(cat);
            
        } catch (err) {
            console.error(err);
            toast.error("Failed to create category");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleCreate} className="space-y-3">
            <div>
                <Label className="mb-1">Create New category</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Men" />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Category"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setName(""); }}>
                    Clear
                </Button>
            </div>

            <div className="pt-2 text-sm text-muted-foreground">
                Tip: create categories first so they appear in the product form.
            </div>
        </form>
    );
}