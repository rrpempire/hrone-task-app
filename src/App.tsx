import React, { useState } from "react";

type FieldType = "string" | "number" | "nested";

interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  children?: Field[];
}

const App = () => {
  const [fields, setFields] = useState<Field[]>([]);

  const addField = (fieldList: Field[], setList: (f: Field[]) => void) => {
    setList([
      ...fieldList,
      {
        id: Math.random().toString(),
        name: "",
        type: "string",
        required: false,
        children: [],
      },
    ]);
  };

  const updateField = (
    id: string,
    key: keyof Field,
    value: any,
    fieldList: Field[],
    setList: (f: Field[]) => void
  ) => {
    const updated = fieldList.map((field) =>
      field.id === id ? { ...field, [key]: value } : field
    );
    setList(updated);
  };

  const deleteField = (
    id: string,
    fieldList: Field[],
    setList: (f: Field[]) => void
  ) => {
    const updated = fieldList.filter((field) => field.id !== id);
    setList(updated);
  };

  const renderFields = (
    fieldList: Field[],
    setList: (f: Field[]) => void
  ) => {
    return fieldList.map((field) => (
      <div key={field.id} className="ml-4 border-l-2 pl-4 my-2">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Field name"
            value={field.name}
            onChange={(e) =>
              updateField(field.id, "name", e.target.value, fieldList, setList)
            }
            className="border p-1 rounded w-40"
          />
          <select
            value={field.type}
            onChange={(e) =>
              updateField(field.id, "type", e.target.value, fieldList, setList)
            }
            className="border p-1 rounded w-32"
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="nested">nested</option>
          </select>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) =>
              updateField(
                field.id,
                "required",
                e.target.checked,
                fieldList,
                setList
              )
            }
          />
          <button
            onClick={() => deleteField(field.id, fieldList, setList)}
            className="text-red-500 font-bold"
          >
            ×
          </button>
        </div>

        {field.type === "nested" && field.children && (
          <div className="ml-6 mt-2">
            {renderFields(field.children, (newChildren) =>
              updateField(field.id, "children", newChildren, fieldList, setList)
            )}
            <button
              onClick={() =>
                updateField(
                  field.id,
                  "children",
                  [...(field.children || []), {
                    id: Math.random().toString(),
                    name: "",
                    type: "string",
                    required: false,
                    children: [],
                  }],
                  fieldList,
                  setList
                )
              }
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
            >
              + Add Item
            </button>
          </div>
        )}
      </div>
    ));
  };

  const generateJSON = (fieldList: Field[]): any => {
    const result: any = {};
    for (let field of fieldList) {
      if (field.type === "nested" && field.children) {
        result[field.name || ""] = generateJSON(field.children);
      } else {
        result[field.name || ""] = field.type.toUpperCase();
      }
    }
    return result;
  };

  return (
    <div className="p-4 flex">
      <div className="w-2/3">
        {renderFields(fields, setFields)}
        <button
          onClick={() => addField(fields, setFields)}
          className="bg-blue-600 text-white px-4 py-1 mt-4 rounded"
        >
          + Add Item
        </button>

      <button
  className="block mt-4 bg-gray-300 px-4 py-1 rounded"
  onClick={() => {
    const finalJSON = generateJSON(fields);
    alert("Submitted JSON:\n" + JSON.stringify(finalJSON, null, 2));
  }}
>
  Submit
</button>
      </div>
      <div className="w-1/3 ml-4">
        <pre className="bg-gray-100 p-4 rounded h-full">
          {JSON.stringify(generateJSON(fields), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default App;
