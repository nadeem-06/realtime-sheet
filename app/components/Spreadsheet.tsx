"use client"

import { useEffect, useState } from "react"
import { db } from "../../lib/firebase"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"

const rows = 20
const cols = 10

function getColName(index:number){
  return String.fromCharCode(65 + index)
}

export default function Spreadsheet(){

  const [cells,setCells] = useState<any>({})
  const [saving,setSaving] = useState(false)
  const [activeCell,setActiveCell] = useState("")

  const docRef = doc(db,"sheets","sheet1")

  useEffect(()=>{

    const unsub = onSnapshot(docRef,(snapshot)=>{
      setCells(snapshot.data()?.cells || {})
    })

    return ()=>unsub()

  },[])

  const updateCell = async(id:string,value:string)=>{

    try{

      setSaving(true)

      await updateDoc(docRef,{
        [`cells.${id}`]:value
      })

      setSaving(false)

    }catch(err){
      console.error(err)
      setSaving(false)
    }

  }

  function evaluate(value:string){

    if(!value.startsWith("=")) return value

    try{

      const formula = value.slice(1)

      // SUM formula
      if(formula.startsWith("SUM(")){

        const refs = formula
          .replace("SUM(","")
          .replace(")","")
          .split(",")

        let sum = 0

        refs.forEach((ref)=>{
          sum += Number(cells[ref.trim()] || 0)
        })

        return sum.toString()
      }

      // Basic expressions
      const expression = formula.replace(/[A-Z][0-9]+/g,(ref)=>{
        return cells[ref] || 0
      })

      return eval(expression).toString()

    }catch{
      return "ERR"
    }

  }

  function handleKey(e:any,id:string){

    const col = id.charCodeAt(0)
    const row = parseInt(id.slice(1))

    if(e.key==="ArrowRight"){
      document.getElementById(String.fromCharCode(col+1)+row)?.focus()
    }

    if(e.key==="ArrowLeft"){
      document.getElementById(String.fromCharCode(col-1)+row)?.focus()
    }

    if(e.key==="ArrowDown"){
      document.getElementById(String.fromCharCode(col)+(row+1))?.focus()
    }

    if(e.key==="ArrowUp"){
      document.getElementById(String.fromCharCode(col)+(row-1))?.focus()
    }

  }

  return(

    <div className="p-6">

      <div className="mb-3 text-sm font-medium">
        {saving ? "Saving..." : "Saved ✓"}
      </div>

      <div className="overflow-auto">

      <table className="border-collapse border">

        <thead>

          <tr>

            <th className="border px-4 py-2 bg-gray-900"></th>

            {Array.from({length:cols}).map((_,c)=>(
              <th key={c} className="border px-4 py-2 bg-gray-900 text-gray-200">
                {getColName(c)}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

        {Array.from({length:rows}).map((_,r)=>(
          <tr key={r}>

            <td className="border px-2 bg-gray-900 text-gray-200">
              {r+1}
            </td>

            {Array.from({length:cols}).map((_,c)=>{

              const id = `${getColName(c)}${r+1}`
              const rawValue = cells[id] || ""
              const displayValue = rawValue.startsWith("=")
                ? evaluate(rawValue)
                : rawValue

              return(

                <td key={id} className="border">

                  <input
                    id={id}
                    className={`w-24 p-1 outline-none bg-black text-white ${
                      activeCell===id ? "bg-blue-900" : ""
                    }`}
                    value={displayValue}
                    onFocus={()=>setActiveCell(id)}
                    onKeyDown={(e)=>handleKey(e,id)}
                    onChange={(e)=>updateCell(id,e.target.value)}
                  />

                </td>

              )

            })}

          </tr>
        ))}

        </tbody>

      </table>

      </div>

    </div>

  )
}