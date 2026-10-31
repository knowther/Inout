package br.com.clinica.estoque.repository;

import br.com.clinica.estoque.model.Movimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findAllByOrderByDataHoraDesc();
    List<Movimentacao> findByItemIdOrderByDataHoraDesc(Long itemId);
    boolean existsByItemId(Long itemId);
}
