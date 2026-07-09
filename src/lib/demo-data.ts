import {
  Experiment,
  createId,
} from "./experiment-model";
import { buildAnalysisResult } from "./decision-rules";

function baseTimeline(
  experimentId: string,
  events: Array<{ type: Experiment["timeline"][number]["type"]; description: string; daysAgo: number }>,
) {
  const now = Date.now();
  return events.map((e) => ({
    id: createId("evt"),
    experiment_id: experimentId,
    type: e.type,
    timestamp: new Date(now - e.daysAgo * 86400000).toISOString(),
    description: e.description,
  }));
}

export function createDemoExperiments(): Experiment[] {
  const demos: Experiment[] = [];

  // 1. Checkout simplificado — resultado positivo forte
  {
    const id = "demo_checkout_simplified";
    const analysis = buildAnalysisResult({
      experimentId: id,
      controlVisitors: 4200,
      controlConversions: 504,
      variantVisitors: 4150,
      variantConversions: 581,
      guardrailStatus: "ok",
      riskLevel: "low",
    });
    demos.push({
      id,
      title: "Checkout simplificado (1 passo a menos)",
      status: "decided",
      product_area: "Checkout",
      hypothesis:
        "Se removermos um passo opcional do checkout, a taxa de conclusão de compra aumenta porque reduzimos fricção cognitiva no momento de pagamento.",
      problem_statement:
        "A taxa de abandono no checkout está acima do benchmark interno; usuários reportam confusão no passo de 'confirmação intermediária'.",
      expected_impact: "+8% a +15% na taxa de conclusão de checkout",
      start_date: "2026-03-01",
      end_date: "2026-03-21",
      owner: "Ana Product",
      context:
        "E-commerce B2C. Tráfego pago + orgânico. Sem mudança de preço ou frete durante o teste.",
      risk_notes: "Risco de aumento de erros de endereço se o passo removido validava dados.",
      created_at: "2026-02-20T10:00:00.000Z",
      updated_at: "2026-03-22T15:00:00.000Z",
      variants: [
        {
          id: createId("var"),
          experiment_id: id,
          name: "control",
          description: "Checkout atual com 4 passos",
          visitors: 4200,
          conversions: 504,
          revenue_optional: 126000,
          notes: "AOV ~R$250",
        },
        {
          id: createId("var"),
          experiment_id: id,
          name: "variant_a",
          description: "Checkout com 3 passos (confirmação intermediária removida)",
          visitors: 4150,
          conversions: 581,
          revenue_optional: 145250,
          notes: "AOV estável",
        },
      ],
      metrics: [
        {
          id: createId("met"),
          experiment_id: id,
          name: "Taxa de conclusão de checkout",
          type: "conversion_rate",
          role: "primary",
          direction: "increase",
          minimum_detectable_effect_optional: 0.08,
          baseline_optional: 0.12,
          description: "Pedidos concluídos / visitantes no checkout",
        },
        {
          id: createId("met"),
          experiment_id: id,
          name: "Taxa de erro de endereço",
          type: "conversion_rate",
          role: "guardrail",
          direction: "no_regression",
          description: "Não deve aumentar erros de entrega pós-compra",
        },
      ],
      analysis,
      decision: {
        id: createId("dec"),
        experiment_id: id,
        decision: "ship",
        rationale:
          "Uplift absoluto ~1,9pp com evidência forte, guardrail de erro de endereço estável e custo de implementação baixo. Ship com monitoramento de 30 dias.",
        decided_at: "2026-03-22T15:00:00.000Z",
        decided_by: "Ana Product",
        follow_up_date: "2026-04-22",
        follow_up_metric: "Taxa de erro de endereço + conclusão de checkout",
        learning:
          "Reduzir um passo de confirmação intermediária melhorou conversão sem degradar qualidade de endereço no período do teste.",
        next_action: "Rollout 100% + alerta se erro de endereço subir >0,5pp",
        guardrail_impact: "Sem regressão observada",
        implementation_cost: "low",
        confidence: "high",
        risks: "Baixo — validação de endereço permanece no formulário principal",
      },
      timeline: baseTimeline(id, [
        { type: "created", description: "Hipótese e métricas definidas.", daysAgo: 50 },
        { type: "started", description: "Experimento iniciado (50/50).", daysAgo: 40 },
        { type: "data_added", description: "Resultados agregados importados.", daysAgo: 20 },
        { type: "analyzed", description: "Análise de conversão calculada.", daysAgo: 19 },
        { type: "decision_recorded", description: "Decisão: ship com follow-up.", daysAgo: 18 },
        { type: "follow_up_added", description: "Follow-up de 30 dias agendado.", daysAgo: 18 },
      ]),
    });
  }

  // 2. Novo CTA na landing — inconclusivo
  {
    const id = "demo_landing_cta";
    const analysis = buildAnalysisResult({
      experimentId: id,
      controlVisitors: 3100,
      controlConversions: 248,
      variantVisitors: 3050,
      variantConversions: 259,
      guardrailStatus: "ok",
      riskLevel: "low",
    });
    demos.push({
      id,
      title: "Novo CTA na landing (“Começar grátis”)",
      status: "analyzed",
      product_area: "Acquisition",
      hypothesis:
        "Se mudarmos o CTA de 'Saiba mais' para 'Começar grátis', a taxa de clique para signup aumenta porque a oferta fica mais clara.",
      problem_statement:
        "CTR do hero está estagnado; copy atual é genérica e não comunica o valor de trial.",
      expected_impact: "+10% no CTR do CTA principal",
      start_date: "2026-04-01",
      end_date: "2026-04-14",
      owner: "Bruno Growth",
      context: "Landing de produto SaaS. Tráfego majoritariamente pago (Meta + Google).",
      risk_notes: "Pode atrair usuários menos qualificados se 'grátis' for mal interpretado.",
      created_at: "2026-03-25T09:00:00.000Z",
      updated_at: "2026-04-15T11:00:00.000Z",
      variants: [
        {
          id: createId("var"),
          experiment_id: id,
          name: "control",
          description: "CTA: Saiba mais",
          visitors: 3100,
          conversions: 248,
        },
        {
          id: createId("var"),
          experiment_id: id,
          name: "variant_a",
          description: "CTA: Começar grátis",
          visitors: 3050,
          conversions: 259,
        },
      ],
      metrics: [
        {
          id: createId("met"),
          experiment_id: id,
          name: "CTR do CTA do hero",
          type: "conversion_rate",
          role: "primary",
          direction: "increase",
          description: "Cliques no CTA / visitantes da landing",
        },
        {
          id: createId("met"),
          experiment_id: id,
          name: "Taxa de ativação D1",
          type: "conversion_rate",
          role: "guardrail",
          direction: "no_regression",
          description: "Usuários que completam onboarding no D1",
        },
      ],
      analysis,
      timeline: baseTimeline(id, [
        { type: "created", description: "Experimento de CTA criado.", daysAgo: 30 },
        { type: "started", description: "Teste iniciado.", daysAgo: 25 },
        { type: "data_added", description: "Resultados de 14 dias adicionados.", daysAgo: 12 },
        { type: "analyzed", description: "Análise: evidência inconclusiva.", daysAgo: 11 },
      ]),
    });
  }

  // 3. Promoção — conversão sobe, ticket médio cai
  {
    const id = "demo_promo_aov";
    const analysis = buildAnalysisResult({
      experimentId: id,
      controlVisitors: 2800,
      controlConversions: 336,
      variantVisitors: 2750,
      variantConversions: 413,
      guardrailStatus: "harmed",
      riskLevel: "medium",
    });
    demos.push({
      id,
      title: "Banner de promoção 15% off no carrinho",
      status: "decided",
      product_area: "Growth / Pricing",
      hypothesis:
        "Se exibirmos um desconto de 15% no carrinho, a conversão sobe porque reduz a percepção de risco de preço.",
      problem_statement:
        "Conversão de carrinho → compra abaixo da meta; time de growth propôs desconto tático.",
      expected_impact: "+20% conversão de carrinho; AOV estável",
      start_date: "2026-02-10",
      end_date: "2026-02-24",
      owner: "Carla Analytics",
      context:
        "Campanha de mid-funnel. Guardrail crítico: ticket médio (AOV) e margem bruta.",
      risk_notes: "Desconto pode treinar usuários a esperar promoção e erodir margem.",
      created_at: "2026-02-01T08:00:00.000Z",
      updated_at: "2026-02-25T16:00:00.000Z",
      variants: [
        {
          id: createId("var"),
          experiment_id: id,
          name: "control",
          description: "Sem banner de desconto",
          visitors: 2800,
          conversions: 336,
          revenue_optional: 100800,
          notes: "AOV ~R$300",
        },
        {
          id: createId("var"),
          experiment_id: id,
          name: "variant_a",
          description: "Banner 15% off no carrinho",
          visitors: 2750,
          conversions: 413,
          revenue_optional: 99120,
          notes: "AOV ~R$240 (−20%)",
        },
      ],
      metrics: [
        {
          id: createId("met"),
          experiment_id: id,
          name: "Conversão carrinho → compra",
          type: "conversion_rate",
          role: "primary",
          direction: "increase",
        },
        {
          id: createId("met"),
          experiment_id: id,
          name: "Ticket médio (AOV)",
          type: "average_value",
          role: "guardrail",
          direction: "no_regression",
          description: "Não regressar AOV; queda de ~20% observada na variante",
        },
      ],
      analysis,
      decision: {
        id: createId("dec"),
        experiment_id: id,
        decision: "do_not_ship",
        rationale:
          "Apesar do uplift forte na conversão, o AOV caiu ~20% e a receita agregada não compensou. Guardrail prejudicado → não shipar o desconto permanente.",
        decided_at: "2026-02-25T16:00:00.000Z",
        decided_by: "Carla Analytics",
        follow_up_date: "2026-03-15",
        follow_up_metric: "Receita por visitante (RPV) em testes de desconto seletivo",
        learning:
          "Conversão sozinha engana: promoção aumentou pedidos mas destruiu ticket. Decisão deve olhar receita e margem, não só taxa.",
        next_action: "Testar desconto só em carrinhos abandonados / segmentos de preço sensível",
        guardrail_impact: "AOV −20%; receita agregada ligeiramente pior",
        implementation_cost: "medium",
        confidence: "high",
        risks: "Erosão de margem e ancoragem de preço",
      },
      timeline: baseTimeline(id, [
        { type: "created", description: "Hipótese de promoção registrada.", daysAgo: 70 },
        { type: "started", description: "Teste de banner iniciado.", daysAgo: 60 },
        { type: "data_added", description: "Resultados + AOV adicionados.", daysAgo: 45 },
        { type: "analyzed", description: "Primária positiva; guardrail prejudicado.", daysAgo: 44 },
        { type: "decision_recorded", description: "Decisão: do_not_ship.", daysAgo: 43 },
      ]),
    });
  }

  // 4. Onboarding — amostra insuficiente
  {
    const id = "demo_onboarding_sample";
    const analysis = buildAnalysisResult({
      experimentId: id,
      controlVisitors: 72,
      controlConversions: 18,
      variantVisitors: 68,
      variantConversions: 22,
      guardrailStatus: "unknown",
      riskLevel: "medium",
    });
    demos.push({
      id,
      title: "Onboarding com checklist progressivo",
      status: "running",
      product_area: "Activation",
      hypothesis:
        "Se mostrarmos um checklist progressivo no onboarding, a taxa de ativação sobe porque usuários veem progresso claro.",
      problem_statement:
        "Muitos usuários criam conta mas não completam o primeiro valor (aha moment).",
      expected_impact: "+15% ativação D7",
      start_date: "2026-05-01",
      owner: "Diego PM",
      context: "Produto B2B com baixo volume diário de novos signups.",
      risk_notes: "Checklist pode aumentar carga cognitiva para power users.",
      created_at: "2026-04-28T10:00:00.000Z",
      updated_at: "2026-05-08T09:00:00.000Z",
      variants: [
        {
          id: createId("var"),
          experiment_id: id,
          name: "control",
          description: "Onboarding linear atual",
          visitors: 72,
          conversions: 18,
        },
        {
          id: createId("var"),
          experiment_id: id,
          name: "variant_a",
          description: "Checklist progressivo com 4 itens",
          visitors: 68,
          conversions: 22,
        },
      ],
      metrics: [
        {
          id: createId("met"),
          experiment_id: id,
          name: "Ativação D7",
          type: "conversion_rate",
          role: "primary",
          direction: "increase",
        },
        {
          id: createId("met"),
          experiment_id: id,
          name: "Tempo até primeiro valor",
          type: "average_value",
          role: "guardrail",
          direction: "decrease",
          description: "Não aumentar tempo até aha moment",
        },
      ],
      analysis,
      timeline: baseTimeline(id, [
        { type: "created", description: "Experimento de onboarding criado.", daysAgo: 20 },
        { type: "started", description: "Teste iniciado com baixo volume.", daysAgo: 15 },
        { type: "data_added", description: "Dados parciais (~70/grupo).", daysAgo: 5 },
        { type: "analyzed", description: "Amostra insuficiente — baixa confiabilidade.", daysAgo: 4 },
      ]),
    });
  }

  return demos;
}

export const DEMO_STORY_SUMMARY = `
Quatro experimentos ilustram o ciclo completo:
1) Checkout — evidência forte → ship responsável.
2) CTA — sinal fraco → decisão pendente / coletar mais dados.
3) Promoção — primária sobe, guardrail cai → do_not_ship.
4) Onboarding — amostra pequena → não decidir ainda.
`;
