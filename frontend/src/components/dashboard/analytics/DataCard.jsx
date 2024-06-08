import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import React from 'react'

export default function DataCard({label, value}) {
  return (
    <div
    >
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 text-sm font-medium' title={label}/>
            <CardContent>
                <div>
                    {value}

                </div>

            </CardContent>
           
        </Card>
    </div>
  )
}
