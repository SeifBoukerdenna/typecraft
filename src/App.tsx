import React, { useState } from 'react';
import './App.css';

interface CraftedType {
  name: string;
  properties: { key: string; type: string }[];
}

interface CommandResult {
  lines: string[];
}

function parseCommand(input: string): { command: string; args: string[] } {
  const tokens = input.trim().split(/\s+/);
  return { command: tokens[0].toLowerCase(), args: tokens.slice(1) };
}

function App() {
  const [commandInput, setCommandInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [craftedTypes, setCraftedTypes] = useState<CraftedType[]>([]);

  const handleCommand = (input: string) => {
    const { command, args } = parseCommand(input);
    const result: CommandResult = { lines: [] };

    if (command === 'craft') {
      // Expected syntax: craft type TypeName key:type key:type ...
      if (args[0]?.toLowerCase() !== 'type') {
        result.lines.push("Error: Expected 'type' keyword after 'craft'.");
      } else {
        const typeName = args[1];
        if (!typeName) {
          result.lines.push("Error: Missing type name.");
        } else {
          const properties = args.slice(2)
            .map((propStr) => {
              const parts = propStr.split(':');
              if (parts.length !== 2) return null;
              return { key: parts[0], type: parts[1] };
            })
            .filter((p) => p !== null) as { key: string; type: string }[];

          if (properties.length === 0) {
            result.lines.push("Error: No properties provided.");
          } else {
            const newType: CraftedType = { name: typeName, properties };
            setCraftedTypes((prev) => [...prev, newType]);
            result.lines.push(`Crafted type '${typeName}' successfully.`);
          }
        }
      }
    } else if (command === 'list') {
      if (craftedTypes.length === 0) {
        result.lines.push("No types crafted yet.");
      } else {
        craftedTypes.forEach((type) => {
          result.lines.push(`type ${type.name} = {`);
          type.properties.forEach((prop) => {
            result.lines.push(`  ${prop.key}: ${prop.type};`);
          });
          result.lines.push(`}`);
        });
      }
    } else if (command === 'help') {
      result.lines.push("Available commands:");
      result.lines.push(" craft type TypeName key:type key:type ...");
      result.lines.push(" list - list crafted types");
      result.lines.push(" help - show this help message");
    } else {
      result.lines.push(`Unknown command: '${command}'. Type 'help' for available commands.`);
    }

    setOutput((prev) => [...prev, `> ${input}`, ...result.lines]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commandInput.trim() !== "") {
      handleCommand(commandInput);
      setCommandInput('');
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-output">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Enter command..."
          className="terminal-input"
          autoFocus
        />
      </form>
    </div>
  );
}

export default App;
