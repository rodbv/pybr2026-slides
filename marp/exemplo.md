---
marp: true
theme: pybr2026
lang: pt-BR
paginate: true
footer: Python Brasil 2026
---

<!-- _class: capa -->
<!-- _paginate: false -->
<!-- _footer: "" -->

<div class="selo">14 a 19<br>de outubro<br>de 2026<br>{Floripa/SC}</div>

# Título da palestra

Subtítulo ou frase de efeito

**Seu nome aqui** · @seu_usuario

---

<!-- _class: frase -->

# A sala está torcendo por você.

---

## Na hora de começar

- Solte o ar devagar e beba um gole de água
- O público está do seu lado
- Fale mais devagar e respire entre as frases
- A palestra é sua, no seu ritmo

<!--
Um comentário como este vira anotação do apresentador: aperte P para ver.
Quase toda pessoa palestrante fica nervosa. Se bater o nervosismo, fale para um rosto amigo na plateia.
-->

---

<!-- _class: secao -->
<!-- _paginate: false -->
<!-- _footer: "" -->

# _01_ Uma seção para cada parte da agenda

---

## Código: 8 linhas cabem bem

```python
@dataclass
class Palestra:
    titulo: str
    duracao_min: int = 25

    def cabe_no_slot(self, slot_min: int) -> bool:
        # Reserva 5 minutos para perguntas
        return self.duracao_min + 5 <= slot_min
```

---

> A praticidade vence a pureza.

The Zen of Python, PEP 20

Dicas, <mark>não regras</mark>: use as que servirem para você.

---

<!-- _class: destaque -->

## Sua palestra é para todo mundo

- O público inclui crianças: conteúdo para todas as idades
- Humor sem alvo e exemplos sem estereótipos
- Na dúvida sobre algum conteúdo, a organização ajuda

---

<!-- _class: light -->

## O seu dia de palestra

| Quando | Sugestão |
|---|---|
| Na véspera | Pega leve no karaokê! Voz e descanso em dia |
| No dia | Chegar cedo e testar o notebook no projetor da sala |
| Na palestra | Microfone perto da boca, mesmo ao olhar para o telão |

---

<!-- _class: light frase -->

# Menos texto, letra maior.

---

## Referências

- Código de conduta: [python.org.br/cdc](https://python.org.br/cdc)
- Código colorido: [slidesnippet.com](https://slidesnippet.com)
- Contraste: [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker)
