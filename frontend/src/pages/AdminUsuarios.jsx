import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { LuPencil, LuUserX } from 'react-icons/lu'
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from '../services/adminUsersService'
import { useAuth } from '../context/AuthContext'
import { useLocale } from '../context/LocaleContext'
import { isAdmin } from '../utils/roles'
import Loader from '../components/Loader'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'USER',
  emailVerified: true,
}

function AdminUsuarios() {
  const { t } = useLocale()
  const { user, token, openLogin, refreshUser, logout, hydrating } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [createdCreds, setCreatedCreds] = useState(null)

  const allowed = isAdmin(user)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      if (!token || String(token).startsWith('mock-token')) {
        setError(t('adminUsers.sessionInvalid'))
        setUsers([])
        return
      }

      const current = await refreshUser()
      if (!isAdmin(current)) {
        setError(t('adminUsers.forbidden'))
        setUsers([])
        return
      }

      const list = await listUsers()
      setUsers(Array.isArray(list) ? list : [])
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        setError(t('adminUsers.sessionInvalid'))
        setUsers([])
      } else {
        setError(
          err?.response?.data?.message || err?.message || t('adminUsers.loadFailed'),
        )
        setUsers([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hydrating) return
    if (!token) {
      setLoading(false)
      setUsers([])
      return
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hydrating])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    setForm({
      name: row.name || '',
      email: row.email || '',
      password: '',
      role: row.role || 'USER',
      emailVerified: Boolean(row.emailVerified),
    })
    setFormError('')
    setFormOpen(true)
  }

  async function handleSave(event) {
    event.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (editing) {
        await updateUser(editing.id, form)
        setCreatedCreds(null)
      } else {
        if (form.password && form.password.length < 8) {
          setFormError(t('adminUsers.passwordMin'))
          setSaving(false)
          return
        }
        const created = await createUser(form)
        const payload = created?.user ? created : { user: created }
        setCreatedCreds({
          email: payload.user?.email || form.email,
          temporaryPassword: payload.temporaryPassword,
          resetToken: payload.resetToken,
          emailStatus: payload.emailStatus,
        })
      }
      setFormOpen(false)
      await load()
    } catch (err) {
      setFormError(
        err?.response?.data?.message || err?.message || t('adminUsers.saveFailed'),
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(row) {
    const ok = window.confirm(`${t('adminUsers.confirmDelete')} (${row.email})`)
    if (!ok) return
    try {
      await deleteUser(row.id)
      await load()
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || t('adminUsers.deleteFailed'),
      )
    }
  }

  async function handleRelogin() {
    await logout()
    openLogin()
  }

  if (!token && !hydrating) {
    return (
      <div className="container-fluid px-0 px-sm-2">
        <h1 className="fs-3 mb-2">{t('adminUsers.title')}</h1>
        <p className="text-muted">{t('adminUsers.loginRequired')}</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={openLogin}>
          {t('common.login')}
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid px-0 px-sm-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h1 className="fs-3 fs-md-2 mb-1">{t('adminUsers.title')}</h1>
          <p className="text-muted mb-0">{t('adminUsers.subtitle')}</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={openCreate}
          disabled={!allowed || loading || hydrating || Boolean(error)}
        >
          {t('adminUsers.create')}
        </button>
      </div>

      {createdCreds && (
        <div className="alert alert-success">
          <div className="fw-semibold mb-1">{t('adminUsers.createdTitle')}</div>
          <div className="small mb-1">
            {t('adminUsers.email')}: <code>{createdCreds.email}</code>
          </div>
          {createdCreds.temporaryPassword && (
            <div className="small mb-1">
              {t('adminUsers.temporaryPassword')}:{' '}
              <code>{createdCreds.temporaryPassword}</code>
            </div>
          )}
          <div className="small mb-0 text-muted">
            {t('adminUsers.emailStatus')}: {createdCreds.emailStatus || 'PENDING'}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-success mt-2"
            onClick={() => setCreatedCreds(null)}
          >
            {t('adminUsers.dismiss')}
          </button>
        </div>
      )}

      {(loading || hydrating) && <Loader mensaje={t('states.loading')} />}

      {!loading && !hydrating && error && (
        <div className="alert alert-danger">
          <div className="mb-2">{error}</div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={load}>
              {t('states.retry')}
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleRelogin}>
              {t('common.login')}
            </button>
          </div>
        </div>
      )}

      {!loading && !hydrating && !error && users.length === 0 && <EmptyState />}

      {!loading && !hydrating && !error && users.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t('adminUsers.name')}</th>
                    <th>{t('adminUsers.email')}</th>
                    <th>{t('adminUsers.role')}</th>
                    <th>{t('adminUsers.verified')}</th>
                    <th className="text-end">{t('adminUsers.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            row.role === 'ADMIN'
                              ? 'text-bg-danger'
                              : 'text-bg-secondary'
                          }`}
                        >
                          {row.role === 'ADMIN'
                            ? t('adminUsers.roleAdmin')
                            : t('adminUsers.roleUser')}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.emailVerified
                              ? 'text-bg-success'
                              : 'text-bg-warning'
                          }`}
                        >
                          {row.emailVerified
                            ? t('adminUsers.verifiedYes')
                            : t('adminUsers.verifiedNo')}
                        </span>
                      </td>
                      <td className="text-end text-nowrap">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm me-2 d-inline-flex align-items-center justify-content-center"
                          onClick={() => openEdit(row)}
                          title={t('adminUsers.edit')}
                          aria-label={t('adminUsers.edit')}
                        >
                          <LuPencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm d-inline-flex align-items-center justify-content-center"
                          onClick={() => handleDelete(row)}
                          disabled={
                            row.role === 'ADMIN' ||
                            row.email?.toLowerCase() === user?.email?.toLowerCase()
                          }
                          title={
                            row.role === 'ADMIN'
                              ? t('adminUsers.cannotDeactivateAdmin')
                              : t('adminUsers.delete')
                          }
                          aria-label={t('adminUsers.delete')}
                        >
                          <LuUserX size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal show={formOpen} onHide={() => setFormOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 mb-0">
            {editing ? t('adminUsers.editTitle') : t('adminUsers.createTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave}>
            {formError && <div className="alert alert-danger py-2">{formError}</div>}

            <div className="mb-2">
              <label className="form-label" htmlFor="admin-name">
                {t('adminUsers.name')}
              </label>
              <input
                id="admin-name"
                className="form-control form-control-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="admin-email">
                {t('adminUsers.email')}
              </label>
              <input
                id="admin-email"
                type="email"
                className="form-control form-control-sm"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="admin-password">
                {editing
                  ? t('adminUsers.passwordOptional')
                  : t('adminUsers.passwordOptionalCreate')}
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-control form-control-sm"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                minLength={form.password ? 8 : undefined}
              />
              {!editing && (
                <div className="form-text">{t('adminUsers.passwordAutoHint')}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="admin-role">
                {t('adminUsers.role')}
              </label>
              <select
                id="admin-role"
                className="form-select form-select-sm"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="USER">{t('adminUsers.roleUser')}</option>
                <option value="ADMIN">{t('adminUsers.roleAdmin')}</option>
              </select>
            </div>

            <div className="form-check mb-3">
              <input
                id="admin-verified"
                type="checkbox"
                className="form-check-input"
                checked={Boolean(form.emailVerified)}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailVerified: e.target.checked }))
                }
              />
              <label className="form-check-label" htmlFor="admin-verified">
                {t('adminUsers.emailVerified')}
              </label>
              <div className="form-text">{t('adminUsers.emailVerifiedHint')}</div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFormOpen(false)}
              >
                {t('adminUsers.cancel')}
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? t('adminUsers.saving') : t('adminUsers.save')}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AdminUsuarios
