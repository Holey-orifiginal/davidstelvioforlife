import { getStore } from '@netlify/blobs'

const GOAL = 1533
const STORE_NAME = 'fundraiser'
const BLOB_KEY = 'progress'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
  }
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  const store = getStore({ name: STORE_NAME, consistency: 'strong' })

  if (req.method === 'GET') {
    const data = await store.get(BLOB_KEY, { type: 'json' })
    const raised = data?.raised ?? 0
    const pct = Math.min(Math.round((raised / GOAL) * 100), 100)
    return new Response(JSON.stringify({ raised, goal: GOAL, pct }), {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  if (req.method === 'POST') {
    const adminKey = process.env.ADMIN_KEY
    const providedKey = req.headers.get('x-admin-key')
    if (!adminKey) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: ADMIN_KEY not set' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
    if (providedKey !== adminKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized: incorrect admin key' }), {
        status: 401,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    const raised = Number(body.raised)
    if (isNaN(raised) || raised < 0) {
      return new Response(JSON.stringify({ error: 'Invalid raised amount' }), {
        status: 400,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }

    await store.setJSON(BLOB_KEY, { raised })
    const pct = Math.min(Math.round((raised / GOAL) * 100), 100)
    return new Response(JSON.stringify({ raised, goal: GOAL, pct }), {
      status: 200,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/progress' }
