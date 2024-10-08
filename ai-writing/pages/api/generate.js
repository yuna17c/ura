require('dotenv').config({path: '../../.env'});
import OpenAI from "openai";
import { SYSTEM_INSTR_NEG, SYSTEM_INSTR_POS, INSTR_BEG, INSTR_END, INSTR_POS, INSTR_NEG } from '../../components/variables'

export default async function handler(req, res) {
  const client = new OpenAI();
  const { prompt, ai_type, scenario } = req.body;
  const system_instr = ai_type=='pos' ? SYSTEM_INSTR_POS : SYSTEM_INSTR_NEG
  const general_instr = ai_type=='pos' ? INSTR_POS : INSTR_NEG
  const instruction_total = general_instr + INSTR_BEG + scenario + 'The email task is:' + INSTR_END
  try {
    const response = await client.chat.completions.create({
      messages: [
        {"role": "system", "content": system_instr},
        {"role": "system", "content": instruction_total},
        {"role": "user", "content": prompt},
      ],
      model: 'gpt-4o',
      max_tokens: 30,
      temperature: 1,
      n: 3,
      top_p: 0.55
    });
    const val = response.choices[0].message.content
    res.status(200).json({ response: val });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'can\'t retrieve results from openai.' });
  }
}
