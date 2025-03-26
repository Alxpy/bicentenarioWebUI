import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditUser } from "./EditUser"
import { ChangePassword } from "./ChangePassword"
import React from 'react'

export const TabsSettings = () => {
  return (
    <Tabs defaultValue="account" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      <div className="min-h-[500px] w-full">
        <TabsContent value="account" className="h-full w-full">
          <EditUser />
        </TabsContent>

        <TabsContent value="password" className="h-full w-full">
          <ChangePassword />
        </TabsContent>
      </div>
    </Tabs>
  )
}
