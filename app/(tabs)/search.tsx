import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";

export default function Search() {
  const [text, setText] = useState("");

  return (
    <ThemedView>
      <Header text="Search" />
      <Input text={text} onChange={setText} placeholder="Search events" icon="search-outline" />
      <ThemedText>You typed: {text}</ThemedText>
    </ThemedView>
  );
}
