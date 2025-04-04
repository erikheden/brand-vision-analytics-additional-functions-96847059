
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country, brands, message } = await req.json();
    console.log("Chat function received request for country:", country, "and brands:", brands);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch relevant data from the new table
    const { data: rankingData, error: rankingError } = await supabase
      .from('SBI Ranking Scores 2011-2025')
      .select('*')
      .eq('Country', country)
      .in('Brand', brands);

    if (rankingError) {
      console.error("Error fetching ranking data:", rankingError);
      throw rankingError;
    }

    console.log(`Retrieved ${rankingData.length} ranking data points`);

    // Prepare data context
    const dataContext = rankingData.map(item => 
      `${item.Brand} had a sustainability score of ${item.Score} in ${item.Year}`
    ).join('. ');

    console.log('Sending request to OpenAI with context');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert in analyzing sustainability brand rankings. You have access to Sustainable Brand Index (SBI) data for various brands. 
            The scores range from 0-100, where higher scores indicate better sustainability performance.
            Be concise and focus on insights about brand performance, trends, and comparisons.`
          },
          {
            role: 'user',
            content: `Here is the SBI ranking data for ${country}: ${dataContext}

            User question: ${message}`
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI API Response received');

    return new Response(JSON.stringify({ 
      response: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-rankings function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
