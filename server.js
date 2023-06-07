const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const supabaseUrl = 'https://rqbtiirtwnevqmkydtrm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYnRpaXJ0d25ldnFta3lkdHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4NTE0MzEsImV4cCI6MTk5OTQyNzQzMX0.bsP8RGkJgfPuFUB0m1yCoQT3wZlriw-lpw49Q0wpwD0'
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors()); // Adicionar o middleware do CORS para permitir requisições do frontend
app.use(express.json());

// Listar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível listar os produtos.' });
  }
});

// Localizar produto por ID
app.get('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível localizar o produto.' });
  }
});

// Inserir produto
app.post('/produtos', async (req, res) => {
  try {
    const { nome, preco } = req.body;

    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, preco }]);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível inserir o produto.' });
  }
});

// Editar produto
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const { data, error } = await supabase
      .from('produtos')
      .update({ nome, preco })
      .eq('id', id);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível atualizar o produto.' });
  }
});

// Deletar produto
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível deletar o produto.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});