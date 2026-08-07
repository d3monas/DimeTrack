import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FieldError } from "../fieldError"
import { CloudDownload, CloudUpload, RefreshCw } from "lucide-react"

type SyncManagerThings = {
  syncId: string
  hasSessionPassword: boolean
  onEnableSync: (id: string, password: string) => void
  onPullData: (id: string, password: string) => void
  onPushData: (password?: string) => void
  isSyncing: boolean
  lastSynced: string | null
}

export function SyncManager({ syncId, hasSessionPassword, onEnableSync, onPullData, onPushData, isSyncing, lastSynced }: SyncManagerThings) {
  const [inputId, setInputId] = useState("")
  const [pullPassword, setPullPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [pushPassword, setPushPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleEnable() {
    if (!newPassword.trim()) {
      setErrors({ newPassword: "Password is required to encrypt your data" })
      return
    }
    const newId = crypto.randomUUID().split('-')[0]
    onEnableSync(newId, newPassword.trim())
    setNewPassword("")
    setErrors({})
  }

  function handlePull() {
    if (!inputId.trim() || !pullPassword.trim()) {
      setErrors({ pull: "Sync ID and Password are required to pull data" })
      return
    }
    onPullData(inputId.trim(), pullPassword.trim())
    setPullPassword("")
    setErrors({})
  }

  function handlePush() {
    if (!hasSessionPassword) {
      if (!pushPassword.trim()) {
        setErrors({ pushPassword: "Password required to encrypt data" })
        return
      }
      onPushData(pushPassword.trim())
      setPushPassword("")
    } else {
      onPushData()
    }
    setErrors({})
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Cloud Sync</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Sync your data securely across devices. Your data is encrypted in your browser before being sent to the server. Nobody except you, can read it.
      </p>

      {!syncId ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <div>
              <Label>Connect to Existing Sync</Label>
              <p className="text-xs text-muted-foreground mb-2">Use the Sync ID and Password from another device.</p>
              <Input placeholder="Sync ID" value={inputId} onChange={(e) => setInputId(e.target.value)} className="mb-2" />
              <Input type="password" placeholder="Password" value={pullPassword} onChange={(e) => { setPullPassword(e.target.value); if (errors.pull) setErrors({}) }} />
              {errors.pull && <FieldError message={errors.pull} />}
            </div>
            <Button variant="outline" className="w-full" onClick={handlePull} disabled={isSyncing}>
              <CloudDownload className="h-4 w-4 mr-2" /> Pull Data & Connect
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or Start New</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label>Start New Sync</Label>
              <p className="text-xs text-muted-foreground mb-2">Push this device's data to a new cloud sync.</p>
              <Input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors({}) }} placeholder="Create a secure password" />
              {errors.newPassword && <FieldError message={errors.newPassword} />}
            </div>
            <Button className="w-full" onClick={handleEnable} disabled={isSyncing}>
              <CloudUpload className="h-4 w-4 mr-2" /> Enable Sync & Upload
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border p-3 text-sm space-y-2">
            <p className="flex justify-between"><span className="text-muted-foreground">Your Sync ID:</span> <span className="font-mono font-bold">{syncId}</span></p>
            {lastSynced && <p className="flex justify-between"><span className="text-muted-foreground">Last Synced:</span> <span>{lastSynced}</span></p>}
          </div>

          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-muted-foreground">
            {hasSessionPassword ? "Auto-sync is active. Changes will push to the cloud automatically." : "Auto-sync is paused. Enter your password to push an update manually."}
          </div>

          {!hasSessionPassword && (
            <div>
              <Label>Encryption Password</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter your password to encrypt and push an update.</p>
              <Input 
                type="password" 
                value={pushPassword} 
                onChange={(e) => { setPushPassword(e.target.value); if (errors.pushPassword) setErrors({}) }} 
                placeholder="Password" 
              />
              {errors.pushPassword && <FieldError message={errors.pushPassword} />}
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={handlePush} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> Push Update to Cloud Manually
          </Button>

          <div className="border-t pt-4">
            <Label>Pull Data (Overwrite local)</Label>
            <p className="text-xs text-muted-foreground mb-2">Force download data from the cloud, overwriting this device.</p>
            <div className="flex gap-2">
              <Input type="password" placeholder="Password" value={pullPassword} onChange={(e) => setPullPassword(e.target.value)} />
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => onPullData(syncId, pullPassword)} disabled={isSyncing || !pullPassword}>
              <CloudDownload className="h-4 w-4 mr-2" /> Pull Data
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}