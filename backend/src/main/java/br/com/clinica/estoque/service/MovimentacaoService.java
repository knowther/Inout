package br.com.clinica.estoque.service;

import br.com.clinica.estoque.dto.MovimentacaoRequest;
import br.com.clinica.estoque.model.Item;
import br.com.clinica.estoque.model.Movimentacao;
import br.com.clinica.estoque.model.TipoMovimentacao;
import br.com.clinica.estoque.repository.ItemRepository;
import br.com.clinica.estoque.repository.MovimentacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ItemRepository itemRepository;

    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ItemRepository itemRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.itemRepository = itemRepository;
    }

    public List<Movimentacao> listar(Long itemId) {
        return itemId == null
                ? movimentacaoRepository.findAllByOrderByDataHoraDesc()
                : movimentacaoRepository.findByItemIdOrderByDataHoraDesc(itemId);
    }

    @Transactional
    public Movimentacao registrar(MovimentacaoRequest req) {
        Item item = itemRepository.findById(req.itemId())
                .orElseThrow(() -> new RegraNegocioException("Item não encontrado"));

        int novaQuantidade = req.tipo() == TipoMovimentacao.ENTRADA
                ? item.getQuantidade() + req.quantidade()
                : item.getQuantidade() - req.quantidade();

        if (novaQuantidade < 0) {
            throw new RegraNegocioException(
                    "Estoque insuficiente. Disponível: " + item.getQuantidade() + " " + item.getUnidade());
        }

        item.setQuantidade(novaQuantidade);
        itemRepository.save(item);

        Movimentacao mov = new Movimentacao();
        mov.setItem(item);
        mov.setTipo(req.tipo());
        mov.setQuantidade(req.quantidade());
        mov.setDataHora(LocalDateTime.now());
        mov.setObservacao(req.observacao() == null || req.observacao().isBlank() ? null : req.observacao().trim());
        return movimentacaoRepository.save(mov);
    }
}
