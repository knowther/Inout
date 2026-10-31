package br.com.clinica.estoque.service;

import br.com.clinica.estoque.dto.ItemRequest;
import br.com.clinica.estoque.model.Item;
import br.com.clinica.estoque.repository.ItemRepository;
import br.com.clinica.estoque.repository.MovimentacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final MovimentacaoRepository movimentacaoRepository;

    public ItemService(ItemRepository itemRepository, MovimentacaoRepository movimentacaoRepository) {
        this.itemRepository = itemRepository;
        this.movimentacaoRepository = movimentacaoRepository;
    }

    public List<Item> listar() {
        return itemRepository.findAllByOrderByNomeAsc();
    }

    public Item buscar(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Item não encontrado"));
    }

    @Transactional
    public Item criar(ItemRequest req) {
        String nome = req.nome().trim();
        if (itemRepository.existsByNomeIgnoreCase(nome)) {
            throw new RegraNegocioException("Já existe um item com esse nome");
        }
        Item item = new Item();
        item.setNome(nome);
        item.setUnidade(req.unidade().trim());
        item.setQuantidade(0);
        return itemRepository.save(item);
    }

    @Transactional
    public Item atualizar(Long id, ItemRequest req) {
        Item item = buscar(id);
        String nome = req.nome().trim();
        if (itemRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new RegraNegocioException("Já existe um item com esse nome");
        }
        item.setNome(nome);
        item.setUnidade(req.unidade().trim());
        return itemRepository.save(item);
    }

    @Transactional
    public void excluir(Long id) {
        Item item = buscar(id);
        if (movimentacaoRepository.existsByItemId(id)) {
            throw new RegraNegocioException("Item possui movimentações e não pode ser excluído");
        }
        itemRepository.delete(item);
    }
}
