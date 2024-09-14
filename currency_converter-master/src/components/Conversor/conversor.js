import React, { useState, useEffect } from "react";
import { Card, Button, Form, Input } from "semantic-ui-react";

export default function Conversor({ from, to }) {
  const [loading, setLoading] = useState(false);
  const [valor, setValor] = useState(0);
  const [cotacao, setCotacao] = useState(0);
  const [error, setError] = useState(null); // Estado para armazenar erros

  const convert = async () => {
    setLoading(true);
    setError(null); // Limpa o erro anterior, se houver

    try {
      const url = `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/${from}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro na requisição da API');
      }

      const result = await response.json();
      const rate = result.conversion_rates[to];

      if (!rate) {
        throw new Error('Conversão não encontrada');
      }

      setCotacao(rate);
    } catch (error) {
      console.error("Erro durante a conversão:", error);
      setError(error.message); // Exibe mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convert();
  }, [from, to]);

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {from} para {to}
        </Card.Header>
        <Card.Meta>Cotação Atual: {cotacao}</Card.Meta>
        <Card.Description>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Form>
            <Form.Field>
              <label>{from}:</label>
              <Input
                type="number" // Alterado para aceitar apenas números
                placeholder="Valor"
                onChange={(e) => setValor(e.target.value)} // Pega o valor diretamente
                value={valor}
              />
            </Form.Field>
            <Form.Field>
              <label>{to}:</label>
              <label>{(valor * cotacao).toFixed(2)}</label>
            </Form.Field>
          </Form>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          color="green"
          onClick={convert}
          disabled={loading}
          loading={loading}
          fluid
        >
          Converter
        </Button>
      </Card.Content>
    </Card>
  );
}
