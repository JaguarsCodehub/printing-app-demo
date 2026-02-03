"use client"

import * as React from "react"
import { ChevronsUpDown, AlignJustify } from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

interface DataTableRowHeightProps {
  density: string
  setDensity: (density: string) => void
}

export function DataTableRowHeight({
  density,
  setDensity,
}: DataTableRowHeightProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 flex gap-2"
        >
          <AlignJustify className="h-3.5 w-3.5" />
          Row Height
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Select height</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">Short</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="standard">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Tall</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">Extra Tall</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
