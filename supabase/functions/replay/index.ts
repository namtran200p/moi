import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const { workspace_id } = await req.json();
    if (!workspace_id) {
      return new Response(JSON.stringify({ error: 'Missing workspace_id' }), { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Lấy transactions
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('transaction_date', { ascending: true });

    if (txError) throw txError;

    // Lấy T+ lots
    const { data: tplusLots, error: lotError } = await supabase
      .from('tplus_lots')
      .select('*')
      .eq('workspace_id', workspace_id);

    if (lotError) throw lotError;

    // Lấy bank deposits đang active
    const { data: bankDeposits, error: bankError } = await supabase
      .from('bank_deposits')
      .select('*')
      .eq('workspace_id', workspace_id)
      .eq('is_active', true);

    if (bankError) throw bankError;

    // --- Chạy Replay Engine ---
    // Ở đây bạn sẽ import hàm runReplayEngine từ src/engine/replay.ts
    // Vì đây là Deno, bạn cần chuyển đổi module sang định dạng phù hợp.
    // Hiện tại tôi để giả định kết quả.
    const result = {
      total_original_capital: 0,
      total_nav: 0,
      total_pl: 0,
      category_summary: {},
      ticker_holdings: [],
      active_tplus_cards: [],
      bank_warnings: [],
    };

    // (Tùy chọn) Lưu snapshot vào bảng workspace_snapshots để cache

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});