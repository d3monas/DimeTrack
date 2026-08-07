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
  const [inputId, setInputId] = useState(syncId || "")
  const [password, setPassword] = useState("")
  const [pushPassword, setPushPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleEnable() {
    if (!password.trim()) {
      setErrors({ password: "Password is required to encrypt your data" })
      return
    }
    const newId = syncId || crypto.randomUUID().split('-')[0]
    onEnableSync(newId, password.trim())
    setInputId(newId)
    setPassword("")
    setErrors({})
  }

  function handlePull() {
    if (!inputId.trim() || !password.trim()) {
      setErrors({ general: "Sync ID and Password are required to pull data" })
      return
    }
    onPullData(inputId.trim(), password.trim())
    setPassword("")
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
      <p className="text-sm text-muted-foreground mb-3">
        Sync your data securely across devices. Your data is encrypted in your browser before being sent to the server. Nobody except you, can read it.
      </p>

      {!syncId ? (
        <div className="space-y-4">
          <div>
            <Label>Encryption Password</Label>
            <Input type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({}) }} placeholder="Create a secure password" />
            <FieldError message={errors.password} />
          </div>
          <Button className="w-full" onClick={handleEnable} disabled={isSyncing}>
            <CloudUpload className="h-4 w-4 mr-2" /> Enable Sync & Upload
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border p-3 text-sm space-y-2">
            <p className="flex justify-between"><span className="text-muted-foreground">Your Sync ID:</span> <span className="font-mono font-bold">{syncId}</span></p>
            {lastSynced && <p className="flex justify-between"><span className="text-muted-foreground">Last Synced:</span> <span>{lastSynced}</span></p>}
          </div>

          {!hasSessionPassword && (
            <div>
              <Label>Encryption Password</Label>
              <p className="text-xs text-muted-foreground mb-2">Enter your password to encrypt and push an update.</p>
              <Input type="password" value={pushPassword} onChange={(e) => { setPushPassword(e.target.value); if (errors.pushPassword) setErrors({}) }} placeholder="Password" />
              {errors.pushPassword && <FieldError message={errors.pushPassword} />}
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={handlePush} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> Push Update to Cloud
          </Button>

          <div className="border-t pt-4">
            <Label>Pull Data (On another device)</Label>
            <p className="text-xs text-muted-foreground mb-2">Enter your Sync ID and password to download your data here.</p>
            <div className="flex gap-2">
              <Input placeholder="Sync ID" value={inputId} onChange={(e) => setInputId(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={handlePull} disabled={isSyncing}>
              <CloudDownload className="h-4 w-4 mr-2" /> Pull Data
            </Button>
          </div>
        </div>
      )}
      {errors.general && <FieldError message={errors.general} />}
    </div>
  )
}